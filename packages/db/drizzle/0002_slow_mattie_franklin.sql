CREATE TYPE "public"."memo_type" AS ENUM('TEXT', 'TODO', 'LINK', 'QA', 'CODE');--> statement-breakpoint
ALTER TABLE "memos" RENAME COLUMN "owner_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "memos" RENAME COLUMN "content_type" TO "type";--> statement-breakpoint
ALTER TABLE "memos" DROP CONSTRAINT "memos_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "memos" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ALTER COLUMN "content" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "memos" ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ADD CONSTRAINT "memos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memos" DROP COLUMN "description";