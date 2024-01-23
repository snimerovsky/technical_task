import {ApiProperty} from "@nestjs/swagger";
import {IsEmail} from "class-validator";

export class UpdateUserDto {
    @ApiProperty({example: 'test@gmail.com', description: 'User email', required: true})
    @IsEmail({}, {message: 'Email is not valid'})
    readonly email: string;

    @ApiProperty({example: 'User', description: 'User name', required: true})
    readonly name: string;
}
