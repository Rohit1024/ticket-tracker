"use client";

import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { type getCases } from "../_lib/queries";
import { filterFields, getColumns } from "./cases-table-columns";
import { useCasesTable } from "./cases-table-provider";
import { CasesTableToolbarActions } from "./cases-table-toolbar-actions";

interface CasesTableProps {
  casesPromise: ReturnType<typeof getCases>;
}

export function CasesTable({ casesPromise }: CasesTableProps) {
  // Flags for showcasing some additional features. Feel free to remove them.
  const { enableAdvancedFilter } = useCasesTable();

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data, pageCount } = React.use(casesPromise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter,
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CasesTableToolbarActions table={table} />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
