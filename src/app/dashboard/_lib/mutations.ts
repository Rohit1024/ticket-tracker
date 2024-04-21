import { type Case } from "@/server/db/schema";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";

import { deleteCase } from "./actions";

export function deleteCases({
  rows,
  onSuccess,
}: {
  rows: Row<Case>[];
  onSuccess?: () => void;
}) {
  toast.promise(
    Promise.all(
      rows.map(async (row) =>
        deleteCase({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          id: row.original.id,
        }),
      ),
    ),
    {
      loading: "Deleting...",
      success: () => {
        onSuccess?.();
        return "Cases deleted";
      },
      error: (err) => getErrorMessage(err),
    },
  );
}

// export function updateCases({
//   rows,
//   status,
//   onSuccess,
// }: {
//   rows: Row<Case>[]
//   status?: Case["status"]
//   onSuccess?: () => void
// }) {
//   toast.promise(
//     Promise.all(
//       rows.map(async (row) =>
//         updateCase({
//           id: row.original.id,
//           status: row.original.status
//         })
//       )
//     ),
//     {
//       loading: "Updating...",
//       success: () => {
//         onSuccess?.()
//         return "Tasks updated"
//       },
//       error: (err) => getErrorMessage(err),
//     }
//   )
// }
