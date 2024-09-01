import { IsOptional } from "class-validator";
import { USER_STATUS } from "../interfaces/users.enum";
import { ApiProperty } from "@nestjs/swagger";

export class SearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  status?: USER_STATUS;
}
