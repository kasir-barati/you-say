import { Pagination } from '@src/shared/libs/tapsa-repository/tapsa-repository.type';

export class Serializable<T> {
    public constructor(public readonly serialize: () => Promise<T | T[]>) {}
}

export class PaginatedSerializable<T> {
    public constructor(
        public readonly serialize: () => Promise<Pagination<T>>,
    ) {}
}
