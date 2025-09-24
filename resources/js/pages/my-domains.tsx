import { DataTable } from '@/components/data-table/data-table';
import { DataTableActionBar } from '@/components/data-table/data-table-action-bar';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataTable } from '@/hooks/use-data-table';
import AppLayout from '@/layouts/app-layout';
import { myDomains } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
    CheckCircle,
    CheckCircle2,
    MoreHorizontal,
    Text,
    XCircle,
} from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Domains',
        href: myDomains().url,
    },
];

interface Domain {
    id: number;
    name: string;
    nameservers: string[];
    status: 'Active' | 'Pending' | 'Expired' | 'Redemption';
    category: 'Business' | 'Personal' | 'Other';
    created_at: string;
    expiration_at: string;
}

const allData: Domain[] = [
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
];

const tabs = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Pending', value: 'pending' },
    { title: 'Expired', value: 'expired' },
    { title: 'Redemption', value: 'redemption' },
];

function MyDomains() {
    const [name] = useQueryState('name', parseAsString.withDefault(''));
    const [status] = useQueryState(
        'status',
        parseAsArrayOf(parseAsString).withDefault([]),
    );

    const filteredData = React.useMemo<Domain[]>(() => {
        return allData.filter((domain) => {
            const matchesTitle =
                name === '' ||
                domain.name.toLowerCase().includes(name.toLowerCase());
            const matchesStatus =
                status.length === 0 || status.includes(domain.status);
            return matchesTitle && matchesStatus;
        });
    }, [name, status]);

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
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                size: 32,
                enableSorting: false,
                enableHiding: false,
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
                    placeholder: 'Search titles...',
                    variant: 'text',
                    icon: Text,
                },
                enableColumnFilter: true,
            },

            {
                id: 'nameservers',
                accessorKey: 'nameservers',
                header: 'Nameservers',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        {row.original.nameservers.length > 2
                            ? (() => {
                                  const firstTwo =
                                      row.original.nameservers.slice(0, 2);
                                  const remaining =
                                      row.original.nameservers.length - 2;
                                  return (
                                      <>
                                          {firstTwo.map((ns, index) => (
                                              <span key={index}>{ns}</span>
                                          ))}
                                          <Badge>+{remaining} more</Badge>
                                      </>
                                  );
                              })()
                            : row.original.nameservers.map((ns, index) => (
                                  <span key={index}>{ns}</span>
                              ))}
                    </div>
                ),
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: ({ column }: { column: Column<Domain, unknown> }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: ({ cell }) => {
                    const status = cell.getValue<Domain['status']>();
                    const Icon = status === 'Active' ? CheckCircle2 : XCircle;

                    return (
                        <Badge variant="outline" className="capitalize">
                            <Icon />
                            {status}
                        </Badge>
                    );
                },
                meta: {
                    label: 'Status',
                    variant: 'multiSelect',
                    // Use values matching the actual data (case-sensitive) so filtering works
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
            },
            {
                id: 'category',
                accessorKey: 'category',
                header: 'Category',
            },
            {
                id: 'created_at',
                accessorFn: (row) => row.created_at,
                header: 'Created At',
            },
            {
                id: 'expiration_at',
                accessorFn: (row) => row.expiration_at,
                header: 'Expiration At',
            },
            {
                id: 'actions',
                cell: function Cell() {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
                size: 32,
            },
        ],
        [],
    );

    const { table } = useDataTable({
        data: filteredData,
        columns,
        pageCount: 1,
        initialState: {
            sorting: [{ id: 'name', desc: false }],
            columnPinning: { right: ['actions'] },
        },
        getRowId: (row) => row.id.toString(),
    });

    return (
        <>
            <Head title="My Domains" />
            <div className="p-4">
                <div className="mb-4 flex flex-1 flex-col gap-4">
                    <Tabs defaultValue="all">
                        <TabsList className="mb-2 bg-transparent">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
                                >
                                    {tab.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="all">
                            <DataTable
                                table={table}
                                actionBar={<DataTableActionBar table={table} />}
                            >
                                <DataTableToolbar table={table} />
                            </DataTable>
                        </TabsContent>
                        <TabsContent value="active">
                            <DataTable
                                table={table}
                                actionBar={<DataTableActionBar table={table} />}
                            >
                                <DataTableToolbar table={table} />
                            </DataTable>
                        </TabsContent>
                        <TabsContent value="pending">
                            <DataTable
                                table={table}
                                actionBar={<DataTableActionBar table={table} />}
                            >
                                <DataTableToolbar table={table} />
                            </DataTable>
                        </TabsContent>
                        <TabsContent value="expired">
                            <DataTable
                                table={table}
                                actionBar={<DataTableActionBar table={table} />}
                            >
                                <DataTableToolbar table={table} />
                            </DataTable>
                        </TabsContent>
                        <TabsContent value="redemption">
                            <DataTable
                                table={table}
                                actionBar={<DataTableActionBar table={table} />}
                            >
                                <DataTableToolbar table={table} />
                            </DataTable>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}

MyDomains.layout = (page: React.ReactNode) => {
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};

export default MyDomains;
