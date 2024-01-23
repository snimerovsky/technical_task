import { ApiProperty } from "@nestjs/swagger";


export class SuccessResponse {
    @ApiProperty({example: true, description: 'Did the server response end in success'})
    readonly success: boolean;
}