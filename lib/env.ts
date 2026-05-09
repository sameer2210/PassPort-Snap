type RequiredEnvKey = "NEXT_PUBLIC_APP_NAME" | "NEXT_PUBLIC_APP_URL";

type PublicEnv = Record<RequiredEnvKey, string>;

const REQUIRED_ENV_KEYS: RequiredEnvKey[] = [
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_URL",
];

const FALLBACK_PUBLIC_ENV: PublicEnv = {
  NEXT_PUBLIC_APP_NAME: "Passport Snap",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

const isProduction = process.env.NODE_ENV === "production";

function readEnvValue(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (value?.trim()) {
    return value;
  }

  if (!isProduction) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  if (key === "NEXT_PUBLIC_APP_URL" && process.env.URL?.trim()) {
    return process.env.URL;
  }

  return FALLBACK_PUBLIC_ENV[key];
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
