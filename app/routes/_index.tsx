import { ActionFunctionArgs, json, type MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { columns } from '~/components/columns';
import { CreateButton } from '~/components/create-button';
import { DataTable } from '~/components/data-table';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'RedisCN' },
    { name: 'description', content: 'Welcome to Rediscn' },
  ];
};

export const loader = async () => {
  const keys = await db.keys('*');

  const results = await Promise.all(
    keys.map(async (key) => {
      const type = await db.type(key); // Determine the type of the key
      let value = ''; // Placeholder for the value
      switch (type) {
        case 'string':
          value = (await db.get(key)) ?? '';
          break;
        case 'list':
          // Retrieve the entire list (consider limiting the range for large lists)
          value = JSON.stringify(await db.lrange(key, 0, -1));
          break;
        case 'set':
          value = JSON.stringify(await db.smembers(key));
          break;
        case 'zset':
          // Retrieve the entire sorted set (consider limiting the range for large sets)
          value = JSON.stringify(await db.zrange(key, 0, -1, 'WITHSCORES'));
          break;
        case 'hash':
          value = JSON.stringify(await db.hgetall(key));
          break;
        default:
          value = 'Unsupported type';
      }

      // Return the structured object
      return { key, value, type };
    })
  );

  // Return the results as JSON
  return json(results);
};

export default function Index() {
  const data = useLoaderData<{ key: string; value: string; type: string }[]>();
  console.log('data length: ', data.length);
  return (
    <div className=" h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="p-4">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rediscn!</h2>
            <p className="text-muted-foreground">Here&apos;s your data</p>
          </div>
          <div className="ml-auto ">
            <Form method="post">
              <CreateButton />
            </Form>
          </div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const fields = body.getAll('field[]');
  const values = body.getAll('value[]');

  const intent = body.get('intent')?.toString();
  const key = body.get('key')?.toString();
  const value = body.get('value')?.toString();
  const preset = body.get('preset')?.toString();

  console.log('type of value is ', typeof value);
  console.log('value: ', value);
  console.log('key: ', key);
  console.log('intent: ', intent);
  console.log('preset: ', preset);

  switch (intent) {
    case 'create':
      console.log('preset', preset);
      if (!preset) throw new Error('Preset is required for creating an entry');

      if (preset === 'string') {
        if (!key || !value)
          throw new Error('Key & value are required for string');
        await db.set(key, value);
        return json({ location: '/' }, { status: 201 });
      }
      if (preset === 'hash') {
        try {
          if (!key || !fields.length || !values.length)
            throw new Error('Key, fields and values are required for hash');
          // convert the arrays into an object
          const hash = fields.reduce((acc, current, index) => {
            acc[current] = values[index];
            return acc;
          }, {});
          console.log('hash', hash);
          await db.hset(key, hash);
          return json({ location: '/' }, { status: 201 });
        } catch (err) {
          throw new Response('Operation failed', { status: 500 });
        }
      }
      break;
    case 'edit':
      if (!key || !value) throw new Error('Key and value are required');
      if (preset === 'string') {
        await db.set(key, value);
        return json({ location: '/' }, { status: 200 });
      }
      if (preset === 'hash') {
        await db.hset(key, JSON.parse(value));
        return json({ location: '/' }, { status: 200 });
      }
      throw new Error('Unsupported preset');
    case 'delete':
      if (!key) throw new Error('Key is required');
      await db.del(key);
      return json({ location: '/' }, { status: 200 });

    default:
      return json({ location: '/' }, { status: 400 });
  }
}
