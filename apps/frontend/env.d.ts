namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_BASE_URL: string;
    NEXT_PUBLIC_FRONTEND_URL: string;
    NEXT_PUBLIC_FUSIONAUTH_APPLICATION_ID: string;
    NEXT_PUBLIC_FUSIONAUTH_OAUTH_SCOPES: string;
    NEXT_PUBLIC_NODE_ENV: import('types/node-env.type').NodeEnv;
    BUILD_STANDALONE?: 'true' | 'false';
  }
}
