import { Injectable } from '@nestjs/common';

import { FileRoDto } from './dto';
import { Pagination } from '@you-say/src/shared/libs/tapsa-repository/tapsa-repository.type';
import { BaseSerializer } from '@you-say/src/shared/libs/tapsa-serializer';
import { FileWithRelations } from './files.type';
// import { GetFileByFileId } from './dto/getFileByFileId.dto';

@Injectable()
export class FilesSerializer extends BaseSerializer<
    FileWithRelations,
    FileRoDto
> {
    public async serialize(
        file: FileWithRelations,
        outputType: 'FileRoDto' | 'GetFileByFileId', // : Promise<FileRoDto | GetFileByFileId>
    ) {
        let output: any;

        switch (outputType) {
            case 'FileRoDto':
                output = new FileRoDto(file);
                break;
            case 'GetFileByFileId':
                // output = new GetFileByFileId(file);
                break;
        }

        return output;
    }

    public async serializePaginated(
        value: Pagination<FileWithRelations>,
        outputType: 'FileRoDto',
    ): Promise<Pagination<FileRoDto>> {
        let paginated: Pagination<FileRoDto>;

        if (outputType === 'FileRoDto') {
            paginated = new Pagination<FileRoDto>(
                value.items.map((file) => new FileRoDto(file)),
                value.meta,
                value.links,
            );
        } else {
            paginated = new Pagination<FileRoDto>(
                value.items.map((file) => new FileRoDto(file)),
                value.meta,
                value.links,
            );
        }

        return paginated;
    }
}
