const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_WRITES = 30;
const rateLimitBuckets = new Map<string, number[]>();

export function checkRateLimit(userId: string): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const bucket = rateLimitBuckets.get(userId) ?? [];
  const pruned = bucket.filter((t) => t > windowStart);
  if (pruned.length >= RATE_LIMIT_MAX_WRITES) {
    rateLimitBuckets.set(userId, pruned);
    throw new Error("Rate limited: too many updates. Please wait a moment.");
  }
  pruned.push(now);
  rateLimitBuckets.set(userId, pruned);
}

export async function __clearRateLimitForTests(): Promise<void> {
  rateLimitBuckets.clear();
}
