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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';
import { Form } from '@remix-run/react';

function isValidJSON(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function ValuePreview({
  rowKey,
  value,
}: {
  rowKey: string;
  value: string;
}) {
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
    <Dialog>
      <DialogTrigger asChild>
        <span className="truncate font-medium w-full cursor-pointer">
          {value}
        </span>
        {/* <Button variant="secondary">{value}</Button> */}
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
              <Input id="email" type="text" value={rowKey} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Value</Label>
            <EditorContent placeholder="No text" editor={editor} />

            <input type="hidden" name="intent" value="edit" />
            <input type="hidden" name="key" id="key" value={rowKey} />
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
  );
}
