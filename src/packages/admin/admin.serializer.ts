import { Injectable } from '@nestjs/common';

import { Pagination } from '@you-say/src/shared/libs/tapsa-repository/tapsa-repository.type';
import { BaseSerializer } from '@you-say/src/shared/libs/tapsa-serializer';
import { AdminWithRelations } from './admin.type';
import { AdminRoDto } from './dto';

@Injectable()
export class AdminSerializer extends BaseSerializer<
    AdminWithRelations,
    AdminRoDto
> {
    public async serialize(
        admin: AdminWithRelations,
        outputType: 'AdminRoDto',
    ): Promise<AdminRoDto> {
        if (outputType === 'AdminRoDto') {
            return new AdminRoDto(admin);
        }
    }

    public async serializePaginated(
        value: Pagination<AdminWithRelations>,
        outputType: 'AdminRoDto',
    ): Promise<Pagination<AdminRoDto>> {
        let paginated: Pagination<AdminRoDto>;

        if (outputType === 'AdminRoDto') {
            paginated = new Pagination<AdminRoDto>(
                value.items.map((admin) => new AdminRoDto(admin)),
                value.meta,
                value.links,
            );
        }

        return paginated;
    }
}
