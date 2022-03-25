import { customAlphabet } from 'nanoid';

const PUBLIC_ID_SEED = '123456789ACDFGHJKLPQRSTUVWXYZ';

export function nanoidGenerator(length = 20) {
    return customAlphabet(PUBLIC_ID_SEED, length)();
}
