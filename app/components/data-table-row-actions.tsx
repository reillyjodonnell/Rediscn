import { Row } from '@tanstack/react-table';

import { itemSchema } from '../data/schema';
import { Button } from './ui/button';
import { FileEditIcon, PencilLine, TrashIcon } from 'lucide-react';
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

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react';

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

import CodeBlockComponent from '~/components/code-block-component';

interface DataTableRowActionsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
  ...props
}: DataTableRowActionsProps<TData>) {
  const { value, key } = itemSchema.parse(row.original);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        // Pass lowlight instance directly without additional configuration here
        lowlight,
      }),
    ],
    content: '',
  });

  React.useEffect(() => {
    let formattedValue = value;

    try {
      // Attempt to parse the JSON to see if it is valid
      const json = JSON.parse(value);
      // Prettify and format the JSON string
      formattedValue = JSON.stringify(json, null, 2);
    } catch (error) {
      // If it's not valid JSON, you could handle it differently or just use the original value
      console.error('Provided value is not valid JSON:', error);
    }

    // Update the editor content with the formatted JSON inside a code block
    if (editor) {
      editor.commands.setContent(`
        <pre>${formattedValue}</pre>
      `);
    }
  }, [value, editor]);
  return (
    <div {...props} className=" flex ">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-8 w-8 p-2 mr-2" size="icon" variant="outline">
            <PencilLine className="h-full w-full" />
            <span className="sr-only">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          {/* <DialogHeader>
          <DialogTitle>Save preset</DialogTitle>
          <DialogDescription>
            This will save the current playground state as a preset which you
            can access later or share with others.
          </DialogDescription>
        </DialogHeader> */}
          <Form method="POST">
            <div className="my-4">
              <div className="grid gap-2">
                <Label>Key</Label>
                <Input id="email" type="text" value={key} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Value</Label>
              <EditorContent placeholder="No text" editor={editor} />

              <input type="hidden" name="intent" value="edit" />
              <input type="hidden" name="key" id="key" value={key} />
              <input
                type="hidden"
                name="value"
                id="value"
                value={editor?.state.doc.textContent ?? value}
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
