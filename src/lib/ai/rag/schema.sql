-- 1. Enable pgvector extension in Neon
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge base table for Pine Script & Strategy Schemas
CREATE TABLE IF NOT EXISTS strategy_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Cosine Distance Index for High-Speed Similarity Search
CREATE INDEX IF NOT EXISTS idx_strategy_knowledge_embedding 
ON strategy_knowledge_base USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 50);

-- 4. Hybrid / Similarity Match Query Function
CREATE OR REPLACE FUNCTION match_strategy_knowledge (
    query_embedding vector(768),
    match_threshold float,
    match_count int,
    filter_category varchar(50) DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    category VARCHAR(50),
    title VARCHAR(255),
    content TEXT,
    metadata JSONB,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        skb.id,
        skb.category,
        skb.title,
        skb.content,
        skb.metadata,
        1 - (skb.embedding <=> query_embedding) AS similarity
    FROM strategy_knowledge_base skb
    WHERE (filter_category IS NULL OR skb.category = filter_category)
      AND 1 - (skb.embedding <=> query_embedding) > match_threshold
    ORDER BY skb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
