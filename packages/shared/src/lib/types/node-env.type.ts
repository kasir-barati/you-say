declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
    }
  }
}

export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
  provision = 'provision',
}
