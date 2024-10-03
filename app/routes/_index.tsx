import {
  ActionFunctionArgs,
  defer,
  json,
  type MetaFunction,
} from '@remix-run/node';
import { Form, useLoaderData, Await } from '@remix-run/react';
import { Suspense } from 'react';
import { SkeletonDataTable } from '~/components/TableSkeleton';
import { columns } from '~/components/columns';
import { CreateButton } from '~/components/create-button';
import { DataTable } from '~/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'RedisCN' },
    { name: 'description', content: 'Welcome to Rediscn' },
  ];
};

export const loader = async () => {
  let cursor = '0'; // Starting point for SCAN
  let keys = [];
  const count = 25; // Limit to first 10 keys
  let hasMore = true;
  do {
    // Use SCAN to fetch keys with a COUNT limit
    const result = await db.scan(cursor, 'COUNT', count);
    cursor = result[0]; // The new cursor value
    keys = keys.concat(result[1]); // Add found keys to the list

    if (keys.length >= count) {
      // Break the loop once we've fetched 10 keys
      keys = keys.slice(0, count); // Ensure only 10 keys are returned
      break;
    }
  } while (cursor !== '0'); // SCAN returns '0' when all keys are scanned

  if (cursor === '0') {
    hasMore = false;
  }
  const results = Promise.all(
    keys.map(async (key) => {
      const type = await db.type(key); // Determine the type of the key
      let valuePromise; // Placeholder for the value
      switch (type) {
        case 'string':
          valuePromise = db.get(key) ?? '';
          break;
        case 'list':
          // Retrieve the entire list (consider limiting the range for large lists)
          const listData = await db.lrange(key, 0, -1);
          valuePromise = JSON.stringify(listData);
          break;
        case 'set':
          const setData = db.smembers(key);
          valuePromise = JSON.stringify(setData);
          break;
        case 'zset':
          // Retrieve the entire sorted set (consider limiting the range for large sets)
          const zsetData = db.zrange(key, 0, -1, 'WITHSCORES');
          // convert zrange to string
          valuePromise = JSON.stringify(zsetData);
          // valuePromise = json.stringify(valuePromise);
          break;
        case 'hash':
          const hashData = await db.hgetall(key);
          valuePromise = JSON.stringify(hashData);

          console.log(key);
          console.log('hash valuePromise', valuePromise);
          break;
        default:
          valuePromise = Promise.resolve('Unsupported type');
      }
      const value = await valuePromise; // Await the value

      // Return the structured object
      return { key, value, type };
    })
  );

  // Return the results as JSON
  return defer({
    data: results,
    cursor,
    hasMore,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            RedisCN Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<SkeletonDataTable columnsCount={3} rowsCount={20} />}
          >
            <Await
              resolve={Promise.all([data.data, data.cursor, data.hasMore])}
            >
              {([resolvedData, cursor, hasMore]) => (
                <DataTable
                  loading={false}
                  data={resolvedData}
                  columns={columns}
                  cursor={cursor}
                  hasMore={hasMore}
                />
              )}
            </Await>
          </Suspense>
        </CardContent>
      </Card>
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

    case 'more': {
      console.log('MORE');
      const cursorSent = body.get('cursor')?.toString();
      let keys = [];
      let cursor = cursorSent ?? '';
      const count = 25; // Limit to first 10 keys
      let hasMore = true;
      do {
        // Use SCAN to fetch keys with a COUNT limit
        const result = await db.scan(cursor, 'COUNT', count);
        cursor = result[0]; // The new cursor value
        keys = keys.concat(result[1]); // Add found keys to the list

        if (keys.length >= count) {
          // Break the loop once we've fetched 10 keys
          keys = keys.slice(0, count); // Ensure only 10 keys are returned
          break;
        }
      } while (cursor !== '0'); // SCAN returns '0' when all keys are scanned

      if (cursor === '0') {
        hasMore = false;
      }

      const results = await Promise.all(
        keys.map(async (key) => {
          const type = await db.type(key); // Determine the type of the key
          let valuePromise; // Placeholder for the value
          switch (type) {
            case 'string':
              valuePromise = db.get(key) ?? '';
              break;
            case 'list':
              // Retrieve the entire list (consider limiting the range for large lists)
              const listData = await db.lrange(key, 0, -1);
              valuePromise = JSON.stringify(listData);
              break;
            case 'set':
              const setData = db.smembers(key);
              valuePromise = JSON.stringify(setData);
              break;
            case 'zset':
              // Retrieve the entire sorted set (consider limiting the range for large sets)
              const zsetData = db.zrange(key, 0, -1, 'WITHSCORES');
              // convert zrange to string
              valuePromise = JSON.stringify(zsetData);
              // valuePromise = json.stringify(valuePromise);
              break;
            case 'hash':
              const hashData = await db.hgetall(key);
              valuePromise = JSON.stringify(hashData);

              console.log(key);
              console.log('hash valuePromise', valuePromise);
              break;
            default:
              valuePromise = Promise.resolve('Unsupported type');
          }
          const value = await valuePromise; // Await the value

          // Return the structured object
          return { key, value, type };
        })
      );
      return json({ location: '/', cursor, results, hasMore }, { status: 200 });
    }
    default:
      return json({ location: '/' }, { status: 400 });
  }
}
