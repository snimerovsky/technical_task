import {ApiProperty} from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty({example: '65afa59ad83f5c0817fcc665'})
    id: string;

    @ApiProperty({example: 'User name'})
    name: string;

    @ApiProperty({example: 'test@gmail.com'})
    email: string;

    @ApiProperty({example: '2024-01-23T11:34:11.174Z'})
    createdAt: Date;
}
