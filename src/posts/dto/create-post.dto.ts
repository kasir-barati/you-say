import {
    IsBoolean,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import {
    content_should_be_string,
    title_should_be_string,
    published_should_be_boolean,
    userId_should_be_uuid_v4,
} from '../../contracts/class-validator-errors/error-codes.json';

export class CreatePostDto {
    @IsString({ message: title_should_be_string })
    title!: string;

    @IsOptional()
    @IsString({ message: content_should_be_string })
    content?: string;

    @IsOptional()
    @IsBoolean({ message: published_should_be_boolean })
    published?: boolean = false;

    @IsOptional()
    @IsUUID('4', { message: userId_should_be_uuid_v4 })
    userId?: string;
}
