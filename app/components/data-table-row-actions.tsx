import { Row } from '@tanstack/react-table';

import { itemSchema } from '../data/schema';
import { Button } from './ui/button';
import { FileEditIcon, PencilLine, TrashIcon } from 'lucide-react';
import { Form } from '@remix-run/react';

interface DataTableRowActionsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
  ...props
}: DataTableRowActionsProps<TData>) {
  const task = itemSchema.parse(row.original);
  return (
    <div {...props} className=" flex ">
      <Button className="h-8 w-8 p-2 mr-2" size="icon" variant="outline">
        <PencilLine className="h-full w-full" />
        <span className="sr-only">Edit</span>
      </Button>
      <Form method="DELETE">
        <input hidden name="key" value={task.key} />
        <Button
          type="submit"
          name="intent"
          value="delete"
          className="h-8 w-8 p-2 mr-2"
          size="icon"
          variant="destructive"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </Form>
    </div>
  );
}
