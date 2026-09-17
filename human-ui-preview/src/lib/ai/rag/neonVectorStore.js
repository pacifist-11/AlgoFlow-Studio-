import { neon } from '@neondatabase/serverless';

export class NeonVectorStore {
  constructor(connectionString = process.env.DATABASE_URL) {
    if (!connectionString) {
      console.warn('DATABASE_URL is not set for NeonVectorStore.');
    }
    this.sql = connectionString ? neon(connectionString) : null;
  }

  /**
   * Search knowledge base for relevant Pine Script docs or node patterns
   */
  async searchRelevantContext(queryEmbedding, category = null, topK = 4, threshold = 0.65) {
    if (!this.sql) return [];
    try {
      const results = await this.sql`
        SELECT * FROM match_strategy_knowledge(
          ${JSON.stringify(queryEmbedding)}::vector,
          ${threshold},
          ${topK},
          ${category}
        )
      `;
      return results;
    } catch (err) {
      console.error('Neon vector search failed:', err);
      return [];
    }
  }

  /**
   * Insert new documentation or strategy templates
   */
  async insertKnowledge(category, title, content, embedding, metadata = {}) {
    if (!this.sql) return null;
    return await this.sql`
      INSERT INTO strategy_knowledge_base (category, title, content, embedding, metadata)
      VALUES (${category}, ${title}, ${content}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify(metadata)})
      RETURNING id;
    `;
  }
}
