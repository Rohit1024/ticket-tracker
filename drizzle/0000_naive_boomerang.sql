DO $$ BEGIN
 CREATE TYPE "ticket_tracker_coverbug" AS ENUM('oos', 'googler', 'low-quality', 'no-action-necessary', 'duplicate');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "ticket_tracker_shards" AS ENUM('platform', 'infra', 'data', 'network', 'workspace');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "ticket_tracker_status" AS ENUM('assigned', 'awaiting-assignment', 'WOCR', 'closed', 'IPGS', 'IPCR', 'solution offered', 'transferred');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_tracker_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" varchar(256),
	"ldap" varchar(256),
	"status" "ticket_tracker_status" DEFAULT 'awaiting-assignment' NOT NULL,
	"shard" "ticket_tracker_shards" DEFAULT 'infra' NOT NULL,
	"coverbug" "ticket_tracker_coverbug" DEFAULT 'oos' NOT NULL,
	"stack_id" varchar(30),
	"comments" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"assigned_at" timestamp,
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ticket_tracker_cases" ("case_id");