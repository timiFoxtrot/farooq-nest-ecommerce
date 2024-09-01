import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  // @ApiProperty({ required: false, description: 'The ID of the product' })
  // @IsUUID()
  // @IsOptional()
  // id: string;

  @ApiProperty({ description: 'The name of the product' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @ApiProperty({ description: 'The product price' })
  @IsNotEmpty({ message: 'price is required' })
  price: number;
}
