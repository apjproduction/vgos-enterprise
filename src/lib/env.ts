export type EnvValidationResult = {
  success: boolean;
  values: {
    DATABASE_URL?: string;
    NEXT_PUBLIC_APP_URL?: string;
    OPENAI_API_KEY?: string;
    GITHUB_TOKEN?: string;
    PRODUCT_HUNT_TOKEN?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
  };
  errors: string[];
  warnings: string[];
};

const optionalEnvKeys = [
  "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "PRODUCT_HUNT_TOKEN",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET"
] as const;

function readEnv(): NodeJS.ProcessEnv {
  return typeof process !== "undefined" ? process.env : ({} as NodeJS.ProcessEnv);
}

export function validateEnv(env: NodeJS.ProcessEnv = readEnv()): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!env.DATABASE_URL) {
    errors.push("DATABASE_URL is required for Prisma database operations.");
  }

  optionalEnvKeys.forEach((key) => {
    if (!env[key]) {
      warnings.push(`${key} is not configured. Related connector or app features will stay inactive.`);
    }
  });

  return {
    success: errors.length === 0,
    values: {
      DATABASE_URL: env.DATABASE_URL,
      NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
      OPENAI_API_KEY: env.OPENAI_API_KEY,
      GITHUB_TOKEN: env.GITHUB_TOKEN,
      PRODUCT_HUNT_TOKEN: env.PRODUCT_HUNT_TOKEN,
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET
    },
    errors,
    warnings
  };
}

export function getEnv() {
  return validateEnv(readEnv());
}
