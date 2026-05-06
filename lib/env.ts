type RequiredEnvKey = "NEXT_PUBLIC_APP_NAME" | "NEXT_PUBLIC_APP_URL";

type PublicEnv = Record<RequiredEnvKey, string>;

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_URL",
];

function readEnvValue(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function buildPublicEnv(): PublicEnv {
  return REQUIRED_ENV_KEYS.reduce(
    (acc, key) => {
      acc[key] = readEnvValue(key);
      return acc;
    },
    {} as PublicEnv,
  );
}

export const publicEnv = buildPublicEnv();
