import { DecodedIdToken } from './decoded-id-token.type';

export type User = Pick<DecodedIdToken, 'roles' | 'sub'>;
