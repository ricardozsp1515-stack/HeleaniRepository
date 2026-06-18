ALTER TABLE "images" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_name_unique" UNIQUE("name");