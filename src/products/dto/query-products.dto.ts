import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @ApiProperty()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  paginate?: string;
}
