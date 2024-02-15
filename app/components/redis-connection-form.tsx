import { Form } from '@remix-run/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

export function RedisConnectionForm() {
  return (
    <Form className="p-6 pt-0 grid gap-6">
      <div className="grid gap-2">
        <Label>Connection String</Label>
        <Input type="string" id="connection" name="connection string" />
      </div>
      <div className="grid gap-2">
        <Label>Host</Label>
        <Input type="string" id="host" name="host" />
      </div>
      <div className="grid gap-2">
        <Label>Port</Label>
        <Input type="number" id="port" name="port" />
      </div>
      <div className="grid gap-2">
        <Label>Username</Label>
        <Input type="text" id="username" name="user" />
      </div>
      <div className="grid gap-2">
        <Label>Password</Label>
        <Input type="password" id="password" name="password" />
      </div>

      <Input type="hidden" name="intent" id="intent" value="connect" />
      <Button>Connect</Button>
    </Form>
  );
}
