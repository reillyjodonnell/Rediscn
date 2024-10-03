import { Row } from '@tanstack/react-table';

import { itemSchema } from '../data/schema';
import { Button } from './ui/button';
import { PencilLine, TrashIcon } from 'lucide-react';
import { Form } from '@remix-run/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

// load all highlight.js languages
import { createLowlight, common } from 'lowlight';
import React from 'react';

import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';

// Configure Lowlight with JSON
const lowlight = createLowlight({
  ...common,
});

// Register the JSON language with lowlight
lowlight.register({ json });

import { Editor } from '@monaco-editor/react';
import { deepParseJson } from './value-preview';

interface DataTableRowActionsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
  ...props
}: DataTableRowActionsProps<TData>) {
  const { value, key } = itemSchema.parse(row.original);

  // Memoized deep parsing logic
  const deeplyParsedJson = React.useMemo(() => {
    try {
      // If value is valid JSON, parse it and deep parse
      const parsed = JSON.parse(value);
      return JSON.stringify(deepParseJson(parsed), null, 2);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return value; // Return the raw value if it's not valid JSON
    }
  }, [value]);

  return (
    <div {...props} className=" flex ">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-8 w-8 p-2 mr-2" size="icon" variant="outline">
            <PencilLine className="h-full w-full" />
            <span className="sr-only">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[800px]">
          <Form method="POST">
            <div className="my-4">
              <div className="grid gap-2">
                <Label>Key</Label>
                <Input id="email" type="text" value={key} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Value</Label>
              <Editor
                onChange={(value) => console.log(value)}
                theme="vs-dark"
                className="w-full h-full min-h-[400px]"
                defaultLanguage="json"
                language="json"
                defaultValue={
                  // Prettify and format the JSON string
                  deeplyParsedJson
                }
              />
              <input type="hidden" name="intent" value="edit" />
              <input type="hidden" name="key" id="key" value={key} />
              <input
                type="hidden"
                name="value"
                id="value"
                // value={editor?.state.doc.textContent ?? value}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <Form method="DELETE">
        <input hidden name="key" value={key} />
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
