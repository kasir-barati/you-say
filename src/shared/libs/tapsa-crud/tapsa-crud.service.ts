import {
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ServiceErrorMessage } from '.';
import { BasePrismaRepository } from '../tapsa-repository';
import { IPaginationOptions } from '../tapsa-repository/tapsa-repository.interface';
import {
    EntityDuplicate,
    EntityNotFound,
    EntityRelationNotFound,
    Pagination,
} from '../tapsa-repository/tapsa-repository.type';

export abstract class BaseService<
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
    constructor(
        public repo: BasePrismaRepository<
            Tentity,
            C,
            UO,
            UA,
            GO,
            GA,
            DO,
            DA
            // GB
        >,
        public errorMessage: ServiceErrorMessage,
    ) {}

    async add(obj: C): Promise<Tentity> {
        try {
            return await this.repo.add(obj);
        } catch (error) {
            if (error instanceof EntityRelationNotFound) {
                throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
            } else if (error instanceof EntityDuplicate) {
                throw new HttpException(
                    this.errorMessage.DUPLICATE,
                    HttpStatus.CONFLICT,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async editOne(obj: UO): Promise<Tentity> {
        try {
            return await this.repo.editOne(obj);
        } catch (error) {
            if (error instanceof EntityNotFound) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            } else if (error instanceof EntityRelationNotFound) {
                throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
            } else if (error instanceof EntityDuplicate) {
                throw new HttpException(
                    this.errorMessage.DUPLICATE,
                    HttpStatus.CONFLICT,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async edit(obj: UA): Promise<void> {
        try {
            await this.repo.edit(obj);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            } else if (error instanceof EntityDuplicate) {
                throw new HttpException(
                    this.errorMessage.DUPLICATE,
                    HttpStatus.CONFLICT,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async getOne(obj: GO): Promise<Tentity> {
        try {
            return await this.repo.getOne(obj);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getOneOrFail(obj: GO): Promise<Tentity> {
        try {
            const result = await this.repo.getOneOrFail(obj);

            return result;
        } catch (error) {
            if (error instanceof EntityNotFound) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            }
            throw new InternalServerErrorException(error);
        }
    }

    async get(obj: GA): Promise<Tentity[]> {
        try {
            return await this.repo.get(obj);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getAndPaginate(
        paginationOptions: IPaginationOptions,
        obj: GA,
    ): Promise<Pagination<Tentity>> {
        try {
            return await this.repo.getAndPaginate(paginationOptions, obj);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async checkExist(
        obj: Record<string, any>,
        unique = false,
    ): Promise<boolean> {
        return await this.repo.checkExist(obj, unique);
    }

    async checkExistOrFail(obj: Record<string, any>): Promise<void> {
        try {
            await this.repo.checkExistOrFail(obj, false);
        } catch (error) {
            if (error instanceof EntityNotFound) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            }
            throw new InternalServerErrorException(error);
        }
    }

    async remove(obj: DA): Promise<void> {
        try {
            return await this.repo.remove(obj);
        } catch (error) {
            if (error instanceof EntityNotFound) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            }
            throw new InternalServerErrorException(error);
        }
    }

    async removeOne(obj: DO): Promise<void> {
        try {
            return await this.repo.removeOne(obj);
        } catch (error) {
            if (error instanceof EntityNotFound) {
                throw new NotFoundException(this.errorMessage.NOT_FOUND);
            }
            throw new InternalServerErrorException(error);
        }
    }
}
