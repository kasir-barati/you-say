namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_BASE_URL: string;
    NEXT_PUBLIC_NODE_ENV: import('types/node-env.type').NodeEnv;
    BUILD_STANDALONE?: 'true' | 'false';
  }
}
