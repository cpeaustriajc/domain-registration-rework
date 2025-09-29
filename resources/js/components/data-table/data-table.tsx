import {
    flexRender,
    type Column as TanstackColumn,
    type Table as TanstackTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    scrollAreaProps?: React.ComponentProps<typeof ScrollArea>;
    tableContainerClassName?: string;
}

export function DataTable<TData>({
    table,
    actionBar,
    children,
    className,
    scrollAreaProps,
    tableContainerClassName,
    ...props
}: DataTableProps<TData>) {
    const {
        className: scrollAreaClassName,
        type: scrollAreaType,
        showHorizontalScrollbar,
        ...restScrollAreaProps
    } = scrollAreaProps ?? {};

    const leftPinnedWidth = React.useMemo(() => {
        return table
            .getLeftLeafColumns()
            .reduce((total, column) => total + column.getSize(), 0);
    }, [table]);

    const rightPinnedWidth = React.useMemo(() => {
        return table
            .getRightLeafColumns()
            .reduce((total, column) => total + column.getSize(), 0);
    }, [table]);

    const handlePinnedWheel = React.useCallback((event: React.WheelEvent) => {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, []);

    const getPinnedProps = React.useCallback(
        (column: TanstackColumn<TData>) => {
            const isPinned = column.getIsPinned();
            if (isPinned) {
                return {
                    onWheel: handlePinnedWheel,
                    pinnedClassName: 'touch-pan-y',
                } as const;
            }

            return {
                onWheel: undefined,
                pinnedClassName: undefined,
            } as const;
        },
        [handlePinnedWheel],
    );

    return (
        <div
            className={cn('flex w-full flex-col gap-2.5', className)}
            {...props}
        >
            {children}
            <div
                className={cn(
                    'relative overflow-hidden rounded-md border bg-background shadow-sm',
                    tableContainerClassName,
                )}
            >
                <ScrollArea
                    type={scrollAreaType ?? 'always'}
                    showHorizontalScrollbar={showHorizontalScrollbar ?? true}
                    className={cn('h-[28rem] w-full', scrollAreaClassName)}
                    {...restScrollAreaProps}
                >
                    <Table
                        className="min-w-max"
                        containerClassName="overflow-x-visible overflow-y-visible"
                        fullWidth={false}
                        style={{
                            minWidth: '100%',
                            width:
                                table.getTotalSize() > 0
                                    ? `${table.getTotalSize()}px`
                                    : undefined,
                        }}
                    >
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const { onWheel, pinnedClassName } =
                                            getPinnedProps(header.column);

                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                onWheel={onWheel}
                                                className={cn(
                                                    'sticky top-0 z-30 border-b bg-background',
                                                    pinnedClassName,
                                                )}
                                                style={{
                                                    ...getCommonPinningStyles({
                                                        column: header.column,
                                                        isHeader: true,
                                                        withBorder: true,
                                                        zIndex: 40,
                                                    }),
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef
                                                              .header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const { onWheel, pinnedClassName } =
                                                getPinnedProps(cell.column);

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    onWheel={onWheel}
                                                    className={cn(
                                                        'border-b',
                                                        pinnedClassName,
                                                    )}
                                                    style={{
                                                        ...getCommonPinningStyles({
                                                            column: cell.column,
                                                            withBorder: true,
                                                            zIndex: 30,
                                                        }),
                                                    }}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.getAllColumns().length}
                                        className="h-24 border-b text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
                {leftPinnedWidth > 0 ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-0 h-2.5 bg-background"
                        style={{ width: `${leftPinnedWidth}px` }}
                    />
                ) : null}
                {rightPinnedWidth > 0 ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 right-0 h-2.5 bg-background"
                        style={{ width: `${rightPinnedWidth}px` }}
                    />
                ) : null}
            </div>
            <div className="flex flex-col gap-2.5">
                <DataTablePagination table={table} />
                {actionBar &&
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    actionBar}
            </div>
        </div>
    );
}
