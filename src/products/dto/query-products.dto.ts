import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @ApiProperty({required: false,})
  @IsOptional()
  page?: number;

  @ApiProperty({required: false,})
  @IsOptional()
  limit?: number;

  @ApiProperty({required: false,})
  @IsOptional()
  paginate?: string;
}
