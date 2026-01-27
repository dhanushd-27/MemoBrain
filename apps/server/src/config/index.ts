import type { StringValue } from 'ms';

interface Config {
  // Google OAuth
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };

  // JWT
  jwt: {
    accessSecret: string;
    refreshSecret: string;
  };

  // Cookies
  cookies: {
    accessTokenName: string;
    refreshTokenName: string;
    accessTokenExpire: StringValue;
    refreshTokenExpire: StringValue;
  };

  // Client
  client: {
    appUrl: string;
  };

  // Server
  server: {
    port: number;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvVarAsNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

export const config: Config = {
  google: {
    clientId: getEnvVar("GOOGLE_CLIENT_ID"),
    clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    redirectUri: getEnvVar("GOOGLE_REDIRECT_URI"),
  },

  jwt: {
    accessSecret: getEnvVar("ACCESS_JWT_SECRET"),
    refreshSecret: getEnvVar("REFRESH_JWT_SECRET"),
  },

  cookies: {
    accessTokenName: getEnvVar("ACCESS_TOKEN_COOKIE_NAME", "access_token"),
    refreshTokenName: getEnvVar("REFRESH_TOKEN_COOKIE_NAME", "refresh_token"),
    accessTokenExpire: getEnvVar("ACCESS_TOKEN_EXPIRE", "15m") as StringValue,
    refreshTokenExpire: getEnvVar("REFRESH_TOKEN_EXPIRE", "7d") as StringValue,
  },

  client: {
    appUrl: getEnvVar("CLIENT_APP_URL", "http://localhost:5173"),
  },

  server: {
    port: getEnvVarAsNumber("PORT", 3001),
  },
};

export default config;
