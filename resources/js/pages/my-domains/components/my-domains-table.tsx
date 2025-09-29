import { Column, ColumnDef } from '@tanstack/react-table';
import {
    CheckCircle,
    CheckCircle2,
    MoreHorizontal,
    Pencil,
    Text,
    Trash2,
    XCircle,
} from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import * as React from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list';
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataTable } from '@/hooks/use-data-table';
import type { DataTableRowAction } from '@/types/data-table';

import { DeleteDomainsDialog } from './delete-domains-dialog';
import { MyDomainsTableActionBar } from './my-domains-table-actions-bar';
import { UpdateDomainsSheet } from './update-domains-sheet';

export interface Domain {
    id: number;
    name: string;
    nameservers: string[];
    status: 'Active' | 'Pending' | 'Expired' | 'Redemption';
    category: 'Business' | 'Personal' | 'Other';
    created_at: string;
    expiration_at: string;
}

export interface MyDomainsTableProps {
    data?: Domain[];
    enableAdvancedFilter?: boolean;
    filterMode?: 'advancedFilters' | 'menu';
    statusFilterOverride?: Domain['status'][];
}

const MOCK_DOMAINS: Domain[] = [
    {
        id: 1,
        name: 'example.com',
        nameservers: [
            'ns1.example.com',
            'ns2.example.com',
            'ns3.example.com',
            'ns4.example.com',
            'ns5.example.com',
            'ns6.example.com',
        ],
        status: 'Active',
        category: 'Business',
        created_at: '2023-01-01',
        expiration_at: '2024-12-31',
    },
    {
        id: 2,
        name: 'mywebsite.net',
        nameservers: ['ns1.mywebsite.net', 'ns2.mywebsite.net'],
        status: 'Pending',
        category: 'Personal',
        created_at: '2023-01-01',
        expiration_at: '2025-06-15',
    },
    {
        id: 3,
        name: 'testdomain.org',
        nameservers: ['ns1.testdomain.org', 'ns2.testdomain.org'],
        status: 'Expired',
        category: 'Other',
        created_at: '2023-01-01',
        expiration_at: '2023-08-20',
    },
    ...Array.from({ length: 27 }).map((_, i) => {
        const id = 4 + i;
        const name = `demo-${id}.example`;
        const nameservers =
            id % 3 === 0
                ? ['ns1.demo.example', 'ns2.demo.example', 'ns3.demo.example']
                : ['ns1.demo.example', 'ns2.demo.example'];
        const statuses: Domain['status'][] = ['Active', 'Pending', 'Expired', 'Redemption'];
        const categories: Domain['category'][] = ['Business', 'Personal', 'Other'];
        const status = statuses[id % statuses.length];
        const category = categories[id % categories.length];
        const created = new Date(2022, (id % 12), 1);
        const expiration = new Date(2024 + (id % 3), (id % 12) + 1, 15);

        const pad = (n: number) => String(n).padStart(2, '0');

        return {
            id,
            name,
            nameservers,
            status,
            category,
            created_at: `${created.getFullYear()}-${pad(created.getMonth() + 1)}-${pad(created.getDate())}`,
            expiration_at: `${expiration.getFullYear()}-${pad(expiration.getMonth() + 1)}-${pad(expiration.getDate())}`,
        } as Domain;
    }),
];

export function MyDomainsTable({
    data = MOCK_DOMAINS,
    enableAdvancedFilter = false,
    filterMode = 'advancedFilters',
    statusFilterOverride,
}: MyDomainsTableProps) {
    const [name] = useQueryState('name', parseAsString.withDefault(''));
    const [status] = useQueryState(
        'status',
        parseAsArrayOf(parseAsString).withDefault([]),
    );

    const [rowAction, setRowAction] =
        React.useState<DataTableRowAction<Domain> | null>(null);

    const filteredData = React.useMemo<Domain[]>(() => {
        const effectiveStatus = statusFilterOverride ?? status;
        return data.filter((domain) => {
            const matchesName =
                name === '' ||
                domain.name.toLowerCase().includes(name.toLowerCase());
            const matchesStatus =
                effectiveStatus.length === 0 ||
                effectiveStatus.includes(domain.status);
            return matchesName && matchesStatus;
        });
    }, [data, name, status, statusFilterOverride]);

    const columns = React.useMemo<ColumnDef<Domain>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(v) =>
                            table.toggleAllPageRowsSelected(!!v)
                        }
                        aria-label="Select all rows"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                enablePinning: false,
                size: 32,
            },
            {
                id: 'name',
                accessorKey: 'name',
                header: ({ column }: { column: Column<Domain, unknown> }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Domain Name"
                    />
                ),
                cell: ({ cell }) => (
                    <div>{cell.getValue<Domain['name']>()}</div>
                ),
                meta: {
                    label: 'Name',
                    placeholder: 'Search domains…',
                    variant: 'text',
                    icon: Text,
                },
                enableColumnFilter: true,
                size: 240,
            },
            {
                id: 'nameservers',
                accessorKey: 'nameservers',
                header: 'Nameservers',
                cell: ({ row }) => {
                    const { nameservers } = row.original;
                    if (nameservers.length <= 2) {
                        return (
                            <div className="flex flex-col">
                                {nameservers.map((ns, i) => (
                                    <span key={i}>{ns}</span>
                                ))}
                            </div>
                        );
                    }
                    const firstTwo = nameservers.slice(0, 2);
                    const remaining = nameservers.length - 2;
                    return (
                        <div className="flex flex-col">
                            {firstTwo.map((ns, i) => (
                                <span key={i}>{ns}</span>
                            ))}
                            <Badge>+{remaining} more</Badge>
                        </div>
                    );
                },
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: ({ column }: { column: Column<Domain, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: ({ cell }) => {
                    const value = cell.getValue<Domain['status']>();
                    const Icon = value === 'Active' ? CheckCircle2 : XCircle;
                    return (
                        <Badge
                            variant="outline"
                            className="flex items-center gap-1 capitalize"
                        >
                            <Icon className="h-3 w-3" />
                            {value}
                        </Badge>
                    );
                },
                meta: {
                    label: 'Status',
                    variant: 'multiSelect',
                    options: [
                        { label: 'Active', value: 'Active', icon: CheckCircle },
                        {
                            label: 'Pending',
                            value: 'Pending',
                            icon: CheckCircle2,
                        },
                        { label: 'Expired', value: 'Expired', icon: XCircle },
                        {
                            label: 'Redemption',
                            value: 'Redemption',
                            icon: XCircle,
                        },
                    ],
                },
                enableColumnFilter: true,
                size: 160,
            },
            {
                id: 'category',
                accessorKey: 'category',
                header: 'Category',
                size: 180,
            },
            {
                id: 'created_at',
                accessorFn: (r) => r.created_at,
                header: 'Created At',
                size: 200,
            },
            {
                id: 'expiration_at',
                accessorFn: (r) => r.expiration_at,
                header: 'Expiration At',
                size: 200,
            },
            {
                id: 'actions',
                size: 40,
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">
                                    Open row actions
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    setRowAction({ variant: 'update', row })
                                }
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                    setRowAction({ variant: 'delete', row })
                                }
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                enablePinning: false,
            },
        ],
        [],
    );

    const { table, shallow, debounceMs, throttleMs } = useDataTable({
        data: filteredData,
        columns,
        pageCount: 1,
        initialState: {
            sorting: [{ id: 'name', desc: false }],
            columnPinning: { left: ['select', 'name'], right: ['actions'] },
        },
        getRowId: (row) => row.id.toString(),
        shallow: false,
        clearOnDefault: true,
        enableAdvancedFilter,
    });


    return (
        <>
            <DataTable
                table={table}
                actionBar={<MyDomainsTableActionBar table={table} />}
                scrollAreaProps={{
                    className: 'max-h-[28rem] w-full',
                    showHorizontalScrollbar: true,
                    type: 'auto',
                }}
                tableContainerClassName="shadow-sm"
            >
                {enableAdvancedFilter ? (
                    <DataTableAdvancedToolbar table={table}>
                        <DataTableSortList table={table} align="start" />
                        {filterMode === 'advancedFilters' ? (
                            <DataTableFilterList
                                table={table}
                                shallow={shallow}
                                debounceMs={debounceMs}
                                throttleMs={throttleMs}
                                align="start"
                            />
                        ) : (
                            <DataTableFilterMenu
                                table={table}
                                shallow={shallow}
                                debounceMs={debounceMs}
                                throttleMs={throttleMs}
                            />
                        )}
                    </DataTableAdvancedToolbar>
                ) : (
                    <DataTableToolbar table={table}>
                        <DataTableSortList table={table} align="end" />
                    </DataTableToolbar>
                )}
            </DataTable>
            <UpdateDomainsSheet
                open={rowAction?.variant === 'update'}
                onOpenChange={() => setRowAction(null)}
                domainIds={
                    rowAction?.row?.original ? [rowAction.row.original.id] : []
                }
                initialStatus={rowAction?.row?.original?.status}
                onUpdated={() => setRowAction(null)}
                initialNote=""
            />
            <DeleteDomainsDialog
                open={rowAction?.variant === 'delete'}
                onOpenChange={() => setRowAction(null)}
                domains={
                    rowAction?.row?.original ? [rowAction.row.original] : []
                }
                showTrigger={false}
                onSuccess={() => {
                    rowAction?.row.toggleSelected(false);
                    setRowAction(null);
                }}
            />
        </>
    );
}
