import { Redis } from '@upstash/redis';

export const KEYS = {
  events: 'chivoradar:events:v1',
  venue: (slug: string) => `chivoradar:venue:${slug}:v1`,
  province: (slug: string) => `chivoradar:province:${slug}:v1`,
} as const;

const DEFAULT_TTL = 300;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return Redis.fromEnv();
}

export function getTTL(): number {
  const parsed = Number(process.env.CACHE_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL;
}

export async function getCached<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttl: number = getTTL()): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(key, value as never, { ex: ttl });
  } catch {
    // best-effort; failures never break availability
  }
}