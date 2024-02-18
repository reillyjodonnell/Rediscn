import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from './ui/checkbox';

import { Item } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { ValuePreview } from './value-preview';
import { Badge } from './ui/badge';

export const labels = [
  {
    value: 'string',
    label: 'String',
  },
  {
    value: 'hash',
    label: 'hash',
  },
  {
    value: 'list',
    label: 'List',
  },
  {
    value: 'set',
    label: 'Set',
  },
  {
    value: 'zset',
    label: 'Zset',
  },
  {
    value: 'stream',
    label: 'Stream',
  },
];

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
      <DataTableColumnHeader column={column} className="flex" title="Key" />
    ),
    cell: ({ row }) => {
      return <div className="flex ">{row.getValue('key')}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          className="flex w-full lg:min-w-[400px] max-w-[500px]"
          title="Value"
        />
      );
    },
    cell: ({ row }) => {
      const rowKey = row.getValue('key') as string;
      const value = row.getValue('value') as string;
      const label = labels.find(
        (label) => label.value === row.original.type
      )?.label;
      const type = row.original.type;

      if (!label) throw new Error('Label not found');

      return (
        <div className="flex w-full lg:min-w-[400px] max-w-[500px]">
          {label && (
            <Badge className="mr-2" variant="outline">
              {label}
            </Badge>
          )}

          <ValuePreview
            type={type}
            label={label}
            rowKey={rowKey}
            value={value}
          />
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
