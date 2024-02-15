import { Form } from '@remix-run/react';
import { PresetSelector } from './preset-selector';
import { Preset, presets } from '~/data/redis-preset';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import React, { Fragment } from 'react';

export function RedisCreator() {
  const [selectedPreset, setSelectedPreset] = React.useState<Preset>(
    () => presets[0]
  );

  return (
    <Form method="post">
      <PresetSelector
        selectedPreset={selectedPreset}
        setSelectedPreset={setSelectedPreset}
        presets={presets}
      />
      <div className="grid gap-4 py-4">
        <input
          type="hidden"
          name="preset"
          id="preset"
          value={selectedPreset.id}
        />
        <RedisForm id={selectedPreset.id} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button name="intent" value="create" type="submit">
            Create
          </Button>
        </DialogClose>
      </DialogFooter>
    </Form>
  );
}

function RedisForm({ id }: { id: string }) {
  switch (id) {
    case 'string':
      return (
        <>
          <div className="grid gap-2">
            <Label htmlFor="key">Key</Label>
            <Input name="key" id="key" autoFocus />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input name="value" id="value" />
          </div>
        </>
      );
    case 'hash':
      return <RedisHashUI />;
  }
}

function RedisHashUI() {
  const [arr, setArr] = React.useState([{ id: 0 }]);

  return (
    <>
      <Label>Key</Label>
      <Input name="key" id="key" autoFocus />
      {arr.map(({ id }) => {
        return (
          <Fragment key={id}>
            <div className="grid grid-flow-col gap-2  items-end">
              <div className="grid gap-2">
                <Label htmlFor={`field-${id}`}>field</Label>
                <Input name="field[]" id={`field-${id}`} autoFocus />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`value-${id}`}>Value</Label>
                <Input name="value[]" id={`value-${id}`} />
              </div>
              {arr.length > 1 ? (
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    setArr((prev) => [
                      ...prev.filter((item) => item.id !== id),
                    ]);
                  }}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </Fragment>
        );
      })}
      <div>
        <Button
          variant={'secondary'}
          onClick={() => setArr((prev) => [...prev, { id: prev.length }])}
        >
          Add pair
        </Button>
      </div>
    </>
  );
}
