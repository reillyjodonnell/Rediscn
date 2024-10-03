import Editor from '@monaco-editor/react';

import React, { useTransition } from 'react';

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
import { Copy, Maximize2 } from 'lucide-react';
import { cn } from '~/lib/utils';

// memoize the ValuePreview component
export const ValuePreview = React.memo(ValuePreviewComponent);

function ValuePreviewComponent({
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
  const [isRaw, setIsRaw] = React.useState(false);
  let transition = useTransition();
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [editorValue, setEditorValue] = React.useState(value);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorValue);
  };

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
    <Dialog>
      <DialogTrigger asChild>
        <span className="truncate font-medium w-full cursor-pointer">
          {value}
        </span>
      </DialogTrigger>
      <DialogContent
        className={`${
          isMaximized ? 'w-screen h-screen max-w-none' : 'max-w-3xl'
        }`}
      >
        <Form method="POST" className="space-y-4">
          <input type="hidden" name="preset" value={type} readOnly />
          <input type="hidden" name="label" value={label} readOnly />
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="key" className="min-w-[60px]">
              Key:
            </Label>
            <Input
              id="key"
              type="text"
              value={rowKey}
              readOnly
              className="flex-grow font-mono text-sm"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="value" className="text-lg font-semibold">
                Value
              </Label>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  <Maximize2 className="mr-2 h-4 w-4" />
                  {isMaximized ? 'Minimize' : 'Maximize'}
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isRaw}
                    onCheckedChange={() => setIsRaw((prev) => !prev)}
                    id="raw"
                  />
                  <Label htmlFor="raw">Raw JSON</Label>
                </div>
              </div>
            </div>
            {isRaw ? (
              <div className="my-4">
                <Textarea
                  name="value"
                  id="value"
                  defaultValue={value}
                  className="min-h-[400px] font-mono"
                  onChange={(e) => setEditorValue(e.target.value)}
                />
              </div>
            ) : (
              <>
                <input
                  type="hidden"
                  name="value"
                  id="value"
                  value={editorValue}
                />
                <Editor
                  onChange={(value) => setEditorValue(value ?? '')}
                  theme="vs-dark"
                  className={cn(
                    `w-full h-full  min-h-[400px]`,
                    isMaximized && 'min-h-[70vh]'
                  )}
                  defaultLanguage="json"
                  language="json"
                  defaultValue={deeplyParsedJson}
                  options={{
                    minimap: { enabled: false },

                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </>
            )}
            <input type="hidden" name="intent" value="edit" />
            <input type="hidden" name="key" id="key" value={rowKey} readOnly />
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

export function deepParseJson(obj: any) {
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
