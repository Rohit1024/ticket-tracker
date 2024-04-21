// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ticket_tracker_${name}`);

export const statuses = [
  "assigned",
  "awaiting-assignment",
  "WOCR",
  "closed",
  "IPGS",
  "IPCR",
  "solution offered",
  "transferred",
] as const;
export const shards = [
  "platform",
  "infra",
  "data",
  "network",
  "workspace",
] as const;
export const coverbugs = [
  "oos",
  "googler",
  "low-quality",
  "no-action-necessary",
  "duplicate",
] as const;

export const statusEnum = pgEnum(`ticket_tracker_status`, statuses);

export const shardEnum = pgEnum(`ticket_tracker_shards`, shards);

export const coverbugEnum = pgEnum(`ticket_tracker_coverbug`, coverbugs);

export const cases = createTable(
  "cases",
  {
    id: serial("id").primaryKey(),
    case_id: varchar("case_id", { length: 256 }),
    ldap: varchar("ldap", { length: 256 }),
    status: statusEnum("status").notNull().default("awaiting-assignment"),
    shard: shardEnum("shard").notNull().default("infra"),
    coverbug: coverbugEnum("coverbug").notNull().default("oos"),
    stack_id: varchar("stack_id", { length: 30 }),
    comments: varchar("comments", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    assignedAt: timestamp("assigned_at"),
    closedAt: timestamp("closed_at"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.case_id),
  }),
);

export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;
