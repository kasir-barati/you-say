import { Prisma } from '@prisma/client';

import { Id } from '@src/shared/types';
import {
    IPaginationLinks,
    IPaginationOptions,
} from './tapsa-repository.interface';
import {
    EntityDuplicate,
    EntityNotFound,
    EntityRelationNotFound,
    Pagination,
} from './tapsa-repository.type';

export abstract class BasePrismaRepository<
    Tentity,
    C,
    UO extends { where: Record<string, any> },
    UA extends { where?: Record<string, any> },
    GO extends { where?: Record<string, any> },
    GA extends { where?: Record<string, any> },
    DO extends { where: Record<string, any> },
    DA extends { where?: Record<string, any> },
    // GB extends Prisma.TradeGroupByArgs,
> {
    constructor(private readonly repo: any) {}

    calculateOffset(take: number, page: number) {
        return take * (page - 1);
    }

    createPaginationObject(
        items: Tentity[],
        totalItems: number,
        currentPage: number,
        take: number,
        route?: string,
    ) {
        const totalPages = Math.ceil(totalItems / take);
        const hasFirstPage = route;
        const hasPreviousPage = route && currentPage > 1;
        const hasNextPage = route && currentPage < totalPages;
        const hasLastPage = route;
        const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';
        const routes: IPaginationLinks = {
            first: hasFirstPage ? `${route}${symbol}take=${take}` : '',
            previous: hasPreviousPage
                ? `${route}${symbol}page=${currentPage - 1}&take=${take}`
                : '',
            next: hasNextPage
                ? `${route}${symbol}page=${currentPage + 1}&take=${take}`
                : '',
            last: hasLastPage
                ? `${route}${symbol}page=${totalPages}&take=${take}`
                : '',
        };

        return new Pagination(
            items,
            {
                totalItems: totalItems,
                itemCount: items.length,
                itemsPerPage: take,
                totalPages: totalPages,
                currentPage: currentPage,
            },
            routes,
        );
    }

    resolveOptions(
        paginationOptions: IPaginationOptions,
    ): [number, number, string] {
        const page = paginationOptions.page;
        const take = paginationOptions.take;
        const route = paginationOptions.route;

        return [page, take, route];
    }

    async paginate(
        repository: any,
        paginationOptions: IPaginationOptions,
        obj: GA,
    ): Promise<Pagination<Tentity>> {
        const [page, take, route] = this.resolveOptions(paginationOptions);

        if (page < 1) {
            return this.createPaginationObject([], 0, page, take, route);
        }

        const skip = this.calculateOffset(take, page);
        const totalCount = await this.count(obj.where);
        const itemIds =
            totalCount > 0
                ? (
                      await repository.findMany({
                          select: { id: true },
                          where: obj.where ? obj.where : {},
                          take: take,
                          skip: skip,
                      })
                  ).map((i: { id: Id }) => i.id)
                : [];

        obj.where = { id: { in: itemIds } };

        const items = itemIds.length > 0 ? await this.get(obj) : [];

        return this.createPaginationObject(
            items,
            totalCount,
            page,
            take,
            route,
        );
    }

    async add(obj: C): Promise<Tentity> {
        try {
            return await this.repo.create(obj);
        } catch (error) {
            if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
            ) {
                throw new EntityDuplicate('entity is duplicated');
            } else if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
            ) {
                throw new EntityRelationNotFound('relation entities not found');
            } else {
                throw error;
            }
        }
    }

    async editOne(obj: UO): Promise<Tentity> {
        try {
            return await this.repo.update(obj);
        } catch (error) {
            if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
            ) {
                throw new EntityDuplicate('entity is duplicated');
            } else if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
            ) {
                if (
                    (error as Prisma.PrismaClientKnownRequestError).meta[
                        'cause'
                    ] === 'Record to update not found.'
                ) {
                    throw new EntityNotFound('entity not found');
                } else {
                    throw new EntityRelationNotFound(
                        'relation entities not found',
                    );
                }
            } else {
                throw error;
            }
        }
    }

    async edit(obj: UA): Promise<void> {
        try {
            return await this.repo.updateMany(obj);
        } catch (error) {
            if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
            ) {
                throw new EntityDuplicate('entity is duplicated');
            } else if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
            ) {
                throw new EntityNotFound('relation entities not found');
            } else {
                throw error;
            }
        }
    }

    async getOne(obj: GO): Promise<Tentity> {
        return await this.repo.findFirst(obj);
    }

    async getOneOrFail(obj: GO): Promise<Tentity> {
        const entity = await this.getOne(obj);

        if (!entity) {
            throw new EntityNotFound('entity not found');
        }
        return entity;
    }

    async get(obj: GA): Promise<Tentity[]> {
        return await this.repo.findMany(obj);
    }

    async getAndPaginate(
        paginationOptions: IPaginationOptions = { take: 10, page: 1 },
        obj: GA,
    ): Promise<Pagination<Tentity>> {
        return await this.paginate(this.repo, paginationOptions, obj);
    }

    async remove(obj: DA): Promise<void> {
        await this.repo.deleteMany(obj);
    }

    async removeOne(obj: DO): Promise<void> {
        try {
            await this.repo.delete(obj);
        } catch (error) {
            if (
                (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
            ) {
                throw new EntityNotFound('relation not found');
            } else {
                throw error;
            }
        }
    }

    async count(whereObj: Record<string, any>): Promise<number> {
        return await this.repo.count({ where: whereObj });
    }

    // async groupBy(obj: GB) {
    //     return this.repo.groupBy(obj);
    // }

    async checkExist(
        whereObj: Record<string, any>,
        unique = false,
    ): Promise<boolean> {
        const count = await this.count(whereObj);

        if (unique) {
            if (count === 1) {
                return true;
            }
            return false;
        } else {
            if (count > 0) {
                return true;
            }
            return false;
        }
    }

    async checkExistOrFail(
        whereObj: Record<string, any>,
        unique = false,
    ): Promise<void> {
        if (!(await this.checkExist(whereObj, unique))) {
            throw new EntityNotFound('entity not found');
        }
    }
}
