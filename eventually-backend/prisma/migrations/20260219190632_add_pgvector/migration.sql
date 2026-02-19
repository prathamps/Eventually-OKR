-- This is an empty migration.-- prisma/migrations/<timestamp>-add-pgvector/migration.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "OkrEmbedding" (
  id SERIAL PRIMARY KEY,
  embedding VECTOR(3072) -- dimensions depend on your embedding model
);