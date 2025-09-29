import type { Column } from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronsUpDown,
    ChevronUp,
    EyeOff,
    PanelLeft,
    PanelRight,
    PinOff,
    X,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.ComponentProps<typeof DropdownMenuTrigger> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort() && !column.getCanHide()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    '-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:ring-1 focus:ring-ring focus:outline-none data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
                    className,
                )}
                {...props}
            >
                {title}
                {column.getCanSort() &&
                    (column.getIsSorted() === 'desc' ? (
                        <ChevronDown />
                    ) : column.getIsSorted() === 'asc' ? (
                        <ChevronUp />
                    ) : (
                        <ChevronsUpDown />
                    ))}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-28">
                {column.getCanSort() && (
                    <>
                        <DropdownMenuCheckboxItem
                            className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                            checked={column.getIsSorted() === 'asc'}
                            onClick={() => column.toggleSorting(false)}
                        >
                            <ChevronUp />
                            Asc
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                            checked={column.getIsSorted() === 'desc'}
                            onClick={() => column.toggleSorting(true)}
                        >
                            <ChevronDown />
                            Desc
                        </DropdownMenuCheckboxItem>
                        {column.getIsSorted() && (
                            <DropdownMenuItem
                                className="pl-2 [&_svg]:text-muted-foreground"
                                onClick={() => column.clearSorting()}
                            >
                                <X />
                                Reset
                            </DropdownMenuItem>
                        )}
                    </>
                )}
                {column.getCanHide() && (
                    <DropdownMenuCheckboxItem
                        className="relative pr-8 pl-2 [&_svg]:text-muted-foreground [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                        checked={!column.getIsVisible()}
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff />
                        Hide
                    </DropdownMenuCheckboxItem>
                )}
                {column.getCanPin?.() && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="pl-2 [&_svg]:text-muted-foreground"
                            disabled={column.getIsPinned() === 'left'}
                            onSelect={() => column.pin?.('left')}
                        >
                            <PanelLeft />
                            Pin left
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="pl-2 [&_svg]:text-muted-foreground"
                            disabled={column.getIsPinned() === 'right'}
                            onSelect={() => column.pin?.('right')}
                        >
                            <PanelRight />
                            Pin right
                        </DropdownMenuItem>
                        {column.getIsPinned() && (
                            <DropdownMenuItem
                                className="pl-2 [&_svg]:text-muted-foreground"
                                onSelect={() => column.pin?.(false)}
                            >
                                <PinOff />
                                Unpin
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
