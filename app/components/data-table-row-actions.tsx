import { Row } from '@tanstack/react-table';

import { itemSchema } from '../data/schema';
import { Button } from './ui/button';
import { FileEditIcon, TrashIcon } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = itemSchema.parse(row.original);

  return (
    <div className="w-full">
      <Button className="h-8 w-8 p-2 mr-2" size="icon" variant="outline">
        <FileEditIcon className="h-full w-full" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button className="h-8 w-8 p-2 mr-2" size="icon" variant="outline">
        <TrashIcon className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
