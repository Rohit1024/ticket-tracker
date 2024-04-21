"use client";

import React from "react";
import { type Case } from "@/server/db/schema";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { CreateCaseSheet } from "./create-case-sheet";
import { DeleteCasesDialog } from "./delete-case-dialog";
import { CirclePlus } from "lucide-react";

interface CasesTableToolbarActionsProps {
  table: Table<Case>;
}

export function CasesTableToolbarActions({
  table,
}: CasesTableToolbarActionsProps) {
  const [showCreateCaseSheet, setShowCreateCaseSheet] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteCasesDialog
          cases={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
      <CreateCaseSheet
        open={showCreateCaseSheet}
        onOpenChange={setShowCreateCaseSheet}
      />
      <Button
        variant="outline"
        size={"sm"}
        onClick={() => setShowCreateCaseSheet(true)}
      >
        <CirclePlus className="mr-2 size-4" /> New Case
      </Button>

      {/**
       * Other actions can be added here.
       * For example, export, import, etc.
       */}
    </div>
  );
}
