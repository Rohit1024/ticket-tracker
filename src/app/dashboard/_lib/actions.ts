"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { cases } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/lib/handle-error";

import type { CreateCaseSchema, UpdateCaseSchema } from "./validations";

export async function createCase(input: CreateCaseSchema) {
  try {
    await db.insert(cases).values({
      case_id: input.case_id,
      ldap: input.ldap,
      createdAt: input.createdAt,
      assignedAt: input.assignedAt,
      shard: input.shard,
      status: input.status,
      stack_id: input.stack_id,
      comments: input.comments,
      coverbug: input.coverbug,
      closedAt: input.closedAt,
    }),
      revalidatePath("/dashboard");
    return {
      success: true,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err),
    };
  }
}

export async function updateCase(input: UpdateCaseSchema & { id: number }) {
  noStore();
  try {
    await db
      .update(cases)
      .set({
        case_id: input.case_id,
        ldap: input.ldap,
        createdAt: input.createdAt,
        assignedAt: input.assignedAt,
        closedAt: input.closedAt,
        shard: input.shard,
        status: input.status,
        coverbug: input.coverbug,
        stack_id: input.stack_id,
        comments: input.comments,
      })
      .where(eq(cases.id, input.id));

    revalidatePath("/dashboard");

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCase(input: { id: number }) {
  try {
    await db.delete(cases).where(eq(cases.id, input.id));
    revalidatePath("/dashboard");
    return {
      success: true,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err),
    };
  }
}
