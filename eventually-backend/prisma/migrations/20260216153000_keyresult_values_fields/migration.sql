-- Move from legacy percentage-based progress to explicit value-based tracking.
ALTER TABLE "KeyResult"
ADD COLUMN     "updatedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "targetValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "metric" TEXT NOT NULL DEFAULT '';

UPDATE "KeyResult"
SET
  "updatedValue" = "progress",
  "targetValue" = 100,
  "metric" = '%';

ALTER TABLE "KeyResult" DROP COLUMN "progress";
