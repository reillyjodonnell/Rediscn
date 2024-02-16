import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
// load all highlight.js languages
import { createLowlight, common } from 'lowlight';
import React, { useTransition } from 'react';

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
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form } from '@remix-run/react';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function ValuePreview({
  rowKey,
  value,
  label,
  type,
}: {
  rowKey: string;
  value: string;
  label: string;
  type: string;
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
      //recursively go through each layer and parse
      const json = JSON.parse(value);

      // Prettify and format the JSON string
      formattedValue = JSON.stringify(deepParseJson(json), null, 2);
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

  const [isRaw, setIsRaw] = React.useState(false);

  let transition = useTransition();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="truncate font-medium w-full cursor-pointer">
          {value}
        </span>
      </DialogTrigger>
      <DialogContent className="">
        <Form method="POST">
          <input type="hidden" name="preset" value={type} />
          <input type="hidden" name="label" value={label} />
          <div className="my-4">
            <div className="grid gap-2">
              <Label htmlFor="key">Key</Label>
              <Input id="key" type="text" value={rowKey} />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex ">
              <Label htmlFor="value">Value</Label>
              <div className="flex items-center space-x-2 ml-auto">
                <Switch
                  checked={isRaw}
                  onCheckedChange={() => setIsRaw((prev) => !prev)}
                  id="raw"
                />
                <Label htmlFor="raw">Raw JSON</Label>
              </div>
            </div>
            {isRaw ? (
              <div className="my-4">
                <Textarea name="value" id="value" defaultValue={value} />
              </div>
            ) : (
              <>
                <input
                  type="hidden"
                  name="value"
                  id="value"
                  value={editor?.state.doc.textContent ?? value}
                />
                <EditorContent placeholder="No text" editor={editor} />
              </>
            )}
            <input type="hidden" name="intent" value="edit" />
            <input type="hidden" name="key" id="key" value={rowKey} />
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

function deepParseJson(obj: any) {
  Object.keys(obj).forEach((key) => {
    try {
      // Attempt to parse the property if it's a string
      if (typeof obj[key] === 'string') {
        obj[key] = JSON.parse(obj[key]);
      }
      // If the property is an object, recursively parse it
      if (typeof obj[key] === 'object') {
        deepParseJson(obj[key]);
      }
    } catch (e) {
      // If parsing throws an error, leave the property as is
    }
  });
  return obj;
}
