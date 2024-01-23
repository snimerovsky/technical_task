import { ApiProperty } from "@nestjs/swagger";

export class QueryPaginationRequest {
    @ApiProperty({example: 10, description: 'Clause to select a limited number of records', default: 5, required: false})
    readonly limit: string;

    @ApiProperty({example: 1, description: 'Clause specifies the number of rows to skip before starting to return rows from the query', default: 0, required: false})
    readonly page: string;
}