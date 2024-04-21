import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/server/db";
import { cases, type Case } from "@/server/db/schema";
import type { DrizzleWhere } from "@/types";
import { and, asc, count, desc, gte, lte, or } from "drizzle-orm";

import { filterColumn } from "@/lib/filter-column";

import { type GetCaseSchema } from "./validations";

export async function getCases({
  page,
  per_page,
  sort,
  case_id,
  status,
  shard,
  operator,
  from,
  to,
}: GetCaseSchema) {
  noStore();
  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Case | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to Date objects
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    const where: DrizzleWhere<Case> =
      !operator || operator === "and"
        ? and(
            // Filter tasks by title
            case_id
              ? filterColumn({
                  column: cases.case_id,
                  value: case_id,
                })
              : undefined,
            // Filter tasks by status
            !!status
              ? filterColumn({
                  column: cases.status,
                  value: status,
                  isSelectable: true,
                })
              : undefined,
            // Filter tasks by priority
            !!shard
              ? filterColumn({
                  column: cases.shard,
                  value: shard,
                  isSelectable: true,
                })
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(gte(cases.createdAt, fromDay), lte(cases.createdAt, toDay))
              : undefined,
          )
        : or(
            // Filter tasks by title
            case_id
              ? filterColumn({
                  column: cases.case_id,
                  value: case_id,
                })
              : undefined,
            // Filter tasks by status
            !!status
              ? filterColumn({
                  column: cases.status,
                  value: status,
                  isSelectable: true,
                })
              : undefined,
            // Filter tasks by priority
            !!shard
              ? filterColumn({
                  column: cases.shard,
                  value: shard,
                  isSelectable: true,
                })
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(gte(cases.createdAt, fromDay), lte(cases.createdAt, toDay))
              : undefined,
          );

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(cases)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in cases
            ? order === "asc"
              ? asc(cases[column])
              : desc(cases[column])
            : desc(cases.id),
        );

      const total = await tx
        .select({
          count: count(),
        })
        .from(cases)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / per_page);
    return { data, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}
