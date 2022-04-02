import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * @summary
     * Email max length comes from [this RFC standard](https://www.rfc-editor.org/rfc/rfc3696#section-3 "search 320 in that page")
     */
    @Post()
    create(@Body() createUserRequestDto: CreateUserRequestDto) {
        return this.usersService.create(createUserRequestDto);
    }

    @Get()
    findAll() {
        return this.usersService.get({});
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.getOneOrFail({ where: { id } });
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        // TODO: https://godly-weapon.atlassian.net/browse/YS-20
        // TODO: Check avatar exists, is it this module duty?
        return this.usersService.editOne({
            where: { id },
            data: { ...updateUserDto },
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove({
            where: { id },
        });
    }
}
