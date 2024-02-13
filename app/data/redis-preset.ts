export interface Preset {
  id: string;
  name: string;
}

export const presets: Preset[] = [
  {
    id: 'string', // replace with actual UUID
    name: 'SET/GET (String)',
  },
  {
    id: 'hash', // replace with actual UUID
    name: 'HSET/HGET (Hash)',
  },
  {
    id: 'list', // replace with actual UUID
    name: 'LPUSH/RPUSH (List)',
  },
  {
    id: 'set', // replace with actual UUID
    name: 'SADD/SMEMBERS (Set)',
  },
  {
    id: 'sorted-set', // replace with actual UUID
    name: 'ZADD/ZRANGE (Sorted Set)',
  },
  {
    id: 'pubsub', // replace with actual UUID
    name: 'PUBLISH/SUBSCRIBE (Pub/Sub)',
  },
  {
    id: 'transactions', // replace with actual UUID
    name: 'MULTI/EXEC (Transactions)',
  },
  {
    id: 'hyperloglog', // replace with actual UUID
    name: 'PFADD/PFCOUNT (HyperLogLog)',
  },
  {
    id: 'geo', // replace with actual UUID
    name: 'GEOADD/GEORADIUS (Geo)',
  },
  {
    id: 'stream', // replace with actual UUID
    name: 'XADD/XREAD (Stream)',
  },
];
