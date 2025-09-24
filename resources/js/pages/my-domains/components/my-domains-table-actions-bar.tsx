import type { Table } from '@tanstack/react-table';
import { CheckCircle2, Download, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    DataTableActionBar,
    DataTableActionBarAction,
    DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar';
import { SelectTrigger } from '@radix-ui/react-select';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { exportTableToCSV } from '@/lib/export';

// Domain statuses we support (mocked)
const DOMAIN_STATUSES = ['Active', 'Pending', 'Expired', 'Redemption'] as const;

type DomainStatus = (typeof DOMAIN_STATUSES)[number];

// Supported actions (simplified for domains)
type Action = 'update-status' | 'export' | 'delete';

interface MyDomainsTableActionBarProps<TData> {
    table: Table<TData>;
    // Optional callback to propagate a bulk status change upwards (mock friendly)
    onBulkStatusChange?: (ids: string[], status: DomainStatus) => void;
    // When true, we simulate network latency
    simulateNetworkMs?: number;
}

export function MyDomainsTableActionBar<
    TData extends { id?: number | string; status?: string },
>({
    table,
    onBulkStatusChange,
    simulateNetworkMs = 600,
}: MyDomainsTableActionBarProps<TData>) {
    const rows = table.getFilteredSelectedRowModel().rows;
    const [isPending, startTransition] = React.useTransition();
    const [currentAction, setCurrentAction] = React.useState<Action | null>(
        null,
    );

    const getIsActionPending = React.useCallback(
        (action: Action) => isPending && currentAction === action,
        [isPending, currentAction],
    );

    const withSimulatedLatency = React.useCallback(
        async <T,>(cb: () => Promise<T> | T) => {
            return await new Promise<T>((resolve) => {
                setTimeout(async () => {
                    resolve(await cb());
                }, simulateNetworkMs);
            });
        },
        [simulateNetworkMs],
    );

    const onStatusUpdate = React.useCallback(
        (status: DomainStatus) => {
            if (rows.length === 0) return;
            setCurrentAction('update-status');
            startTransition(() => {
                void withSimulatedLatency(async () => {
                    const ids = rows.map((r) => String(r.original.id ?? ''));
                    // Mock: optionally bubble up
                    onBulkStatusChange?.(ids, status);
                    toast.success(
                        `Updated ${ids.length} domain${ids.length > 1 ? 's' : ''} to "${status}"`,
                    );
                }).finally(() => setCurrentAction(null));
            });
        },
        [rows, onBulkStatusChange, withSimulatedLatency],
    );

    const onExport = React.useCallback(() => {
        if (rows.length === 0) return;
        setCurrentAction('export');
        startTransition(() => {
            exportTableToCSV(table, {
                excludeColumns: ['select', 'actions'],
                onlySelected: true,
                filename: `domains-${Date.now()}.csv`,
            });
            setTimeout(() => setCurrentAction(null), 200); // quick finish
            toast.success('Export started');
        });
    }, [rows, table]);

    const onDelete = React.useCallback(() => {
        if (rows.length === 0) return;
        setCurrentAction('delete');
        startTransition(() => {
            void withSimulatedLatency(async () => {
                const count = rows.length;
                // Mock delete: just clear selection; real implementation would refetch / mutate upstream state
                table.toggleAllRowsSelected(false);
                toast.success(
                    `Deleted ${count} domain${count > 1 ? 's' : ''} (mock)`,
                );
            }).finally(() => setCurrentAction(null));
        });
    }, [rows, table, withSimulatedLatency]);

    return (
        <DataTableActionBar table={table} visible={rows.length > 0}>
            <DataTableActionBarSelection table={table} />
            <Separator
                orientation="vertical"
                className="hidden data-[orientation=vertical]:h-5 sm:block"
            />
            <div className="flex items-center gap-1.5">
                <Select
                    onValueChange={(value: DomainStatus) =>
                        onStatusUpdate(value)
                    }
                >
                    <SelectTrigger asChild>
                        <DataTableActionBarAction
                            size="icon"
                            tooltip="Update status"
                            isPending={getIsActionPending('update-status')}
                        >
                            <CheckCircle2 />
                        </DataTableActionBarAction>
                    </SelectTrigger>
                    <SelectContent align="center">
                        <SelectGroup>
                            {DOMAIN_STATUSES.map((status) => (
                                <SelectItem
                                    key={status}
                                    value={status}
                                    className="capitalize"
                                >
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DataTableActionBarAction
                    size="icon"
                    aria-label="Export selected"
                    isPending={getIsActionPending('export')}
                    onClick={onExport}
                    disabled={rows.length === 0}
                >
                    <Download />
                </DataTableActionBarAction>
                <DataTableActionBarAction
                    size="icon"
                    aria-label="Delete selected"
                    isPending={getIsActionPending('delete')}
                    onClick={onDelete}
                    disabled={rows.length === 0}
                >
                    <Trash2 />
                </DataTableActionBarAction>
            </div>
        </DataTableActionBar>
    );
}
