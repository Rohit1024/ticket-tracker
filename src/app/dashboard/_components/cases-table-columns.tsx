"use client";

import * as React from "react";
import { coverbugs, shards, statuses, type Case } from "@/server/db/schema";
import type { DataTableFilterField } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { DeleteCasesDialog } from "./delete-case-dialog";
import { UpdateCaseSheet } from "./update-case-sheet";
import { Ellipsis } from "lucide-react";

export const filterFields: DataTableFilterField<Case>[] = [
  {
    label: "Case Id",
    value: "case_id",
    placeholder: "Filter based on Ids...",
  },
  {
    label: "Status",
    value: "status",
    options: statuses.map((status) => ({
      label: status[0]?.toUpperCase() + status.slice(1),
      value: status,
    })),
  },
  {
    label: "Shard",
    value: "shard",
    options: shards.map((shard) => ({
      label: shard[0]?.toUpperCase() + shard.slice(1),
      value: shard,
    })),
  },
  {
    label: "Coverbug",
    value: "coverbug",
    options: coverbugs.map((cb) => ({
      label: cb[0]?.toUpperCase() + cb.slice(1),
      value: cb,
    })),
  },
];

export function getColumns(): ColumnDef<Case>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "case_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Case Id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("case_id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ldap",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ldap" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("ldap")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status === row.original.status,
        );

        if (!status) return null;

        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">{status}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "shard",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shard" />
      ),
      cell: ({ row }) => {
        const shard = shards.find((shard) => shard === row.original.shard);

        if (!shard) return null;

        return (
          <div className="flex items-center">
            <span className="capitalize">{shard}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "closedAt",
      header: ({ column }) => {
        <DataTableColumnHeader column={column} title="Closed At" />;
      },
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "coverbug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Coverbug" />
      ),
      cell: ({ row }) => {
        const cb = coverbugs.find((cb) => cb === row.original.coverbug);

        if (!cb) return null;

        return (
          <div className="flex items-center">
            <span className="capitalize">{cb}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "assignedAt",
      header: ({ column }) => {
        <DataTableColumnHeader column={column} title="Assigned At" />;
      },
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "stack_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stackoverflow Id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("stack_id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "comments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comments" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("comments")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateCaseSheet, setShowUpdateCaseSheet] =
          React.useState(false);
        const [showDeleteCaseDialog, setShowDeleteCaseDialog] =
          React.useState(false);

        return (
          <>
            <UpdateCaseSheet
              open={showUpdateCaseSheet}
              onOpenChange={setShowUpdateCaseSheet}
              ticket={row.original}
            />
            <DeleteCasesDialog
              open={showDeleteCaseDialog}
              onOpenChange={setShowDeleteCaseDialog}
              cases={[row]}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="data-[state=open]:bg-muted flex size-8 p-0"
                >
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateCaseSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteCaseDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
