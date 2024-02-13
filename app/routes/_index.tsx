import { json, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { columns } from '~/components/columns';
import { DataTable } from '~/components/data-table';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async () => {
  const keys = await db.keys('*');
  // get the value for each key
  const values = await Promise.all(keys.map((key) => db.get(key)));
  console.log(values);

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
          <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
