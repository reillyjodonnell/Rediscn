import React, { useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Item } from '~/data/schema';

import { Cross2Icon } from '@radix-ui/react-icons';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { Form, useFetcher } from '@remix-run/react';
import { CreateButton } from './create-button';

import { useInView } from 'react-intersection-observer';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [items, setItems] = React.useState<TData[]>(data);
  const [cursor, setCursor] = React.useState('');

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 20,
  });

  const fetcher = useFetcher();

  const isFiltered = table.getState().columnFilters.length > 0;

  React.useEffect(() => {
    if (fetcher.data?.results && fetcher.state === 'idle') {
      console.log('Setting items');
      console.log(fetcher.data.results);
      setItems((prev) => [...prev, ...fetcher.data.results]);
      setCursor(fetcher.data.cursor);
    }
  }, [fetcher.data, fetcher.state]);

  function fetchMore() {
    fetcher.submit({ cursor, intent: 'more' }, { method: 'post' });
  }

  return (
    <div className="space-y-4 flex-1 h-full">
      <div className="flex items-center justify-start space-x-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter data..."
            value={(table.getColumn('key')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('key')?.setFilterValue(event.target.value)
            }
            className="h-8 w-full max-w-[300px]"
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 justify-center items-center flex"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
        <Form className="flex-1 flex justify-end" method="post">
          <CreateButton />
        </Form>
      </div>
      <div ref={parentRef} className="flex-1 h-full overflow-auto max-h-[90vh]">
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <Table className="rounded-md border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index] as Row<Item>;

                return (
                  <RowComponent
                    addIntersectionObserver={
                      virtualRow.index === rows.length - 10
                    }
                    key={row.id}
                    inViewFunction={fetchMore}
                    dataState={row.getIsSelected() && 'selected'}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </RowComponent>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function RowComponent({
  dataState,
  style,
  children,
  addIntersectionObserver,
  inViewFunction,
}: {
  dataState: string | boolean;
  style: React.CSSProperties;
  children: React.ReactNode;
  addIntersectionObserver: boolean;
  inViewFunction?: () => void;
}) {
  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && inViewFunction) {
        inViewFunction();
      }
    },
    threshold: 0.2,
  });

  return (
    <TableRow
      ref={addIntersectionObserver ? ref : undefined}
      data-state={dataState}
      style={style}
    >
      {children}
    </TableRow>
  );
}
