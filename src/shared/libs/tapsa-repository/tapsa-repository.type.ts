import {
    IPaginationLinks,
    IPaginationMeta,
} from './tapsa-repository.interface';

export class Pagination<T> {
    constructor(
        public readonly items: T[],
        public readonly meta: IPaginationMeta,
        public readonly links: IPaginationLinks,
    ) {}
}

export class EntityNotFound extends Error {}

export class EntityRelationNotFound extends Error {}

export class EntityDuplicate extends Error {}

export class TenantNotSet extends Error {}
