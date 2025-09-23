import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { GlobeLockIcon, LockIcon } from 'lucide-react';

interface Domain {
    id: number;
    name: string;
    nameservers: string[];
    category: string;
    expiration_at: string;
    created_at: string;
}

export const columns: ColumnDef<Domain>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
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
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Domain Name',
    },
    {
        accessorKey: 'nameservers',
        header: 'Nameservers',
        cell: ({ row }) => {
            const domain = row.original;
            return (
                <div className="flex items-center gap-2">
                    <p>{domain.nameservers.slice(0, 2).join(', ')}</p>
                    {domain.nameservers.length > 2 && (
                        <Badge>+{domain.nameservers.length - 2} more</Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
    },
    {
        accessorKey: 'restrictions',
        header: 'Restrictions',
        cell: () => {
            return (
                <Button size="icon" variant="ghost">
                    <LockIcon />
                </Button>
            );
        },
    },
    {
        accessorKey: 'privacy',
        header: 'Privacy',
        cell: () => {
            return (
                <Button size="icon" variant="ghost">
                    <GlobeLockIcon />
                </Button>
            );
        },
    },
    {
        accessorKey: 'expiration_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Expiration At" />
        ),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
    },
];
