import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from './ui/checkbox';

import { Item } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Item>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'key',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="flex ml-6 lg:min-w-[400px] max-w-[400px]"
        title="Key"
      />
    ),
    cell: ({ row }) => (
      <div className="flex ml-6 lg:min-w-[400px] max-w-[400px]">
        {row.getValue('key')}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="flex w-full lg:min-w-[400px] max-w-[500px]"
        title="Value"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full lg:min-w-[400px] max-w-[500px]">
          <span className="truncate font-medium w-full ">
            {row.getValue('value')}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="max-w-[80px]"
        title="Actions"
      />
    ),
    cell: ({ row }) => (
      <DataTableRowActions className="w-[100px] max-w-[80px]" row={row} />
    ),
    enableSorting: false,
    enableHiding: true,
  },
];
