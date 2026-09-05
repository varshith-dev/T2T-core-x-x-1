ALTER TYPE "public"."role" ADD VALUE 'super_admin';--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ml_is_waste" boolean;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ml_waste_score" double precision;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "final_category" "category";