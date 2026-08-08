// lib/flags.ts
// Env-backed feature flags. Everything defaults OFF: a flag is on only when its
// variable is exactly "true". NEXT_PUBLIC_ prefix so the value is available on
// both the server and the client.
export const flags = {
  comments_enabled: process.env.NEXT_PUBLIC_COMMENTS_ENABLED === 'true',
} as const

export type FeatureFlag = keyof typeof flags
