import { NodeEnv } from '@shared';

export const logger = {
  error(messages: unknown) {
    if (process.env.NEXT_PUBLIC_NODE_ENV === NodeEnv.production) {
      return;
    }
    console.error(messages);
  },
  warn(messages: unknown) {
    if (process.env.NEXT_PUBLIC_NODE_ENV === NodeEnv.production) {
      return;
    }
    console.warn(messages);
  },
  log(messages: unknown) {
    if (process.env.NEXT_PUBLIC_NODE_ENV === NodeEnv.production) {
      return;
    }
    console.log(messages);
  },
  info(messages: unknown) {
    if (process.env.NEXT_PUBLIC_NODE_ENV === NodeEnv.production) {
      return;
    }
    console.info(messages);
  },
};
