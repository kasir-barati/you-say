import { customAlphabet } from 'nanoid';

const PUBLIC_ID_SEED =
    '_-acdfghjklpqrstuvwxyz123456789ACDFGHJKLPQRSTUVWXYZ';

/**
 *
 * @param {number} length The predefined value in the prisma.schema
 * @returns {string}
 */
export function nanoidGenerator(length = 21) {
    return customAlphabet(PUBLIC_ID_SEED, length)();
}
