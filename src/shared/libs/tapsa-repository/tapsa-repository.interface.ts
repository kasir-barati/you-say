import { Pagination } from './tapsa-repository.type';

export interface IPaginationOptions {
    take: number;
    page: number;
    route?: string;
}

export interface IPaginationMeta {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IPaginationLinks {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
}
export declare type Dictionary<T = any> = {
    [k: string]: T;
};
export declare type EntityData<T> = {
    [P in keyof T]?: T[P] | any;
} & Dictionary;

export interface IRepository<Tentity> {
    add(
        entity: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity>;
    editOne(
        where: Record<string, any>,
        entityObj: EntityData<Tentity>,
        checkExist?: boolean,
        include?: Record<string, any>,
    ): Promise<Tentity>;
    edit(
        where: Record<string, any>,
        entityObj: EntityData<Tentity>,
    ): Promise<void>;
    getOne(
        fields?: string[],
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity>;
    getOneOrFail(
        fields?: string[],
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity>;
    remove(
        where: Record<string, any>,
        checkExist?: boolean,
    ): Promise<void>;
    removeOne(
        where: Record<string, any>,
        checkExist?: boolean,
    ): Promise<void>;
    get(
        fields?: string[],
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity[]>;
    getAndPaginate(
        paginationOptions?: IPaginationOptions,
        fields?: string[],
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Pagination<Tentity>>;
    count(where: Record<string, any>): Promise<number>;
    checkExist(where: Record<string, any>): Promise<boolean>;
    checkExistOrFail(where: Record<string, any>): Promise<void>;
}
