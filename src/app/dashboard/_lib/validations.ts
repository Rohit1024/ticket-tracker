import { cases } from "@/server/db/schema";
import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  case_id: z.string().optional(),
  status: z.string().optional(),
  shard: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getCaseSchema = searchParamsSchema;

export type GetCaseSchema = z.infer<typeof getCaseSchema>;

export const createCaseSchema = z.object({
  case_id: z.string(),
  ldap: z.string(),
  createdAt: z.date(),
  assignedAt: z.date(),
  closedAt: z.date().optional(),
  shard: z.enum(cases.shard.enumValues),
  status: z.enum(cases.status.enumValues),
  coverbug: z.enum(cases.coverbug.enumValues).optional(),
  stack_id: z.string(),
  comments: z.string(),
});

export type CreateCaseSchema = z.infer<typeof createCaseSchema>;

export const updateCaseSchema = z.object({
  case_id: z.string(),
  ldap: z.string(),
  createdAt: z.date(),
  assignedAt: z.date(),
  closedAt: z.date().optional(),
  shard: z.enum(cases.shard.enumValues),
  status: z.enum(cases.status.enumValues),
  coverbug: z.enum(cases.coverbug.enumValues).optional(),
  stack_id: z.string(),
  comments: z.string(),
});

export type UpdateCaseSchema = z.infer<typeof updateCaseSchema>;
