import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import { BuyNewDomainSheet } from "./buy-new-domain-task-sheet";
import { DeleteDomainsDialog } from "./delete-domains-dialog";

interface MyDomainsTableToolbarActionsProps<TData> { table: Table<TData>; }

export function MyDomainsTableToolbarActions<TData>({ table }: MyDomainsTableToolbarActionsProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteDomainsDialog
          domains={table.getFilteredSelectedRowModel().rows.map(r => r.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <BuyNewDomainSheet />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
