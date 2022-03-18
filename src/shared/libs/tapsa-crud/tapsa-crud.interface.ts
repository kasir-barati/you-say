import { IPaginationOptions } from '@src/shared/libs/tapsa-repository/tapsa-repository.interface';
import { Pagination } from '@src/shared/libs/tapsa-repository/tapsa-repository.type';

export interface IBaseService<Tentity> {
    add(entity: Tentity, include?: Record<string, any>): Promise<Tentity>;

    editOne(
        where: Record<string, any>,
        entityObj: Record<string, any>,
        checkExist?: boolean,
        include?: Record<string, any>,
    ): Promise<void | Tentity>;

    getOne(
        where: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity>;

    getOneOrFail(
        where: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity>;

    remove(where: Record<string, any>, checkExist?: boolean): Promise<void>;

    get(
        fields?: string[] | string,
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Tentity[]>;

    getAndPaginate(
        paginationOptions?: IPaginationOptions,
        fields?: string[] | string,
        where?: Record<string, any>,
        queryOptions?: Record<string, any>,
        include?: Record<string, any>,
    ): Promise<Pagination<Tentity>>;
}
