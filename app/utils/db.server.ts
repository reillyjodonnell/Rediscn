import Redis from 'ioredis';

import { singleton } from './singleton.server';

// Hard-code a unique key, so we can look up the client when this module gets re-imported
export const db = singleton(
  'redis',
  () => new Redis(process.env.REDIS_URL ?? '')
);
