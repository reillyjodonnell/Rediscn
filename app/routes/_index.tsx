import { ActionFunctionArgs, json, type MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { columns } from '~/components/columns';
import { CreateButton } from '~/components/create-button';
import { DataTable } from '~/components/data-table';
import { UserNav } from '~/components/user-nav';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'RedisCN' },
    { name: 'description', content: 'Welcome to Rediscn' },
  ];
};

export const loader = async () => {
  const keys = await db.keys('*');
  // get the value for each key
  const values = await Promise.all(keys.map((key) => db.get(key)));

  // return them as key value pairs
  return json(keys.map((key, i) => ({ key, value: values[i] })));
};

export default function Index() {
  const data = useLoaderData<{ key: string; value: string }[]>();
  // the shape is { key: string, value: string }[]

  return (
    <div className=" h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="p-4">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rediscn!</h2>
            <p className="text-muted-foreground">Here&apos;s your data</p>
          </div>
          <div className="ml-auto mr-6">
            <Form method="post">
              <CreateButton />
            </Form>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>

        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const intent = body.get('intent')?.toString();
  const key = body.get('key')?.toString();
  const value = body.get('value')?.toString();
  const preset = body.get('preset')?.toString();

  switch (intent) {
    case 'create':
      console.log('preset', preset);
      if (!key || !value || !preset)
        throw new Error('Key, value, and preset are required');
      if (preset === 'string') {
        await db.set(key, value);
        return json({ location: '/' }, { status: 201 });
      }
      break;
    case 'delete':
      if (!key) throw new Error('Key is required');
      await db.del(key);
      return json({ location: '/' }, { status: 200 });

    default:
      return json({ location: '/' }, { status: 400 });
  }
}
