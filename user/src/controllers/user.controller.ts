import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    Body,
    Controller, Delete, Get, Param,
    Post, Put, Query, UsePipes
} from "@nestjs/common";
import {UserService} from "../services/user.service";
import {CreateUserDto} from "../schemas/dto/create/create-user.dto";
import {SuccessResponse} from "../schemas/response/success.response";
import {ValidationPipe} from "../commons/pipes/validation.pipe";
import {UpdateUserDto} from "../schemas/dto/update/update-user.dto";
import {QueryPaginationRequest} from "../schemas/request/query-pagination.request";
import {ParseObjectIdPipe} from "../commons/pipes/parse-object-id.pipe";
import {UserResponse} from "../schemas/response/user.response";

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/')
    @ApiOperation({summary: 'Get users list'})
    @ApiResponse({status: 200, type: [UserResponse]})
    getUsersList(@Query() query: QueryPaginationRequest) {
        return this.userService.getUsersList(query)
    }

    @Get('/:id')
    @ApiOperation({summary: 'Get user by id'})
    @ApiResponse({status: 200, type: UserResponse})
    getUserById(@Param('id', ParseObjectIdPipe) id: string) {
        return this.userService.getUserById(id)
    }

    @Post('/')
    @ApiOperation({summary: "Create user"})
    @ApiResponse({status: 201, type: UserResponse})
    @UsePipes(ValidationPipe)
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto)
    }

    @Put(`/:id`)
    @ApiOperation({summary: 'Update user'})
    @ApiResponse({status: 200, type: SuccessResponse})
    @UsePipes(ValidationPipe)
    updateUser(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto)
    }

    @Delete(`/:id`)
    @ApiOperation({summary: 'Delete user'})
    @ApiResponse({status: 200, type: SuccessResponse})
    deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
        return this.userService.deleteUser(id)
    }
}
