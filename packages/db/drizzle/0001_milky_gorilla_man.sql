CREATE TABLE "slice_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slice_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(256) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "slices" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "slices" RENAME COLUMN "author_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";--> statement-breakpoint
ALTER TABLE "slices" DROP CONSTRAINT "slices_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "memos" ADD COLUMN "content_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memos" ADD COLUMN "owner_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_id" varchar(256);--> statement-breakpoint
ALTER TABLE "slice_access" ADD CONSTRAINT "slice_access_slice_id_slices_id_fk" FOREIGN KEY ("slice_id") REFERENCES "public"."slices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slice_access" ADD CONSTRAINT "slice_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memos" ADD CONSTRAINT "memos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slices" ADD CONSTRAINT "slices_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memos" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "slices" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE("google_id");