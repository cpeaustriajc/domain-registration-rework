import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className={cn(
                        '-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:ring-1 focus:ring-ring focus:outline-none data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
                        className,
                    )}
                >
                    <span>{title}</span>
                    {column.getIsSorted() === 'desc' ? (
                        <ArrowDown />
                    ) : column.getIsSorted() === 'asc' ? (
                        <ArrowUp />
                    ) : (
                        <ChevronsUpDown />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
