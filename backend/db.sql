-- ── PostgreSQL Feedbacks Table Initialization ──

CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example insert query
-- INSERT INTO feedbacks (email, rating, category, feedback_text) VALUES ('test@example.com', 5, 'UI/UX Design', 'Looks awesome!');
