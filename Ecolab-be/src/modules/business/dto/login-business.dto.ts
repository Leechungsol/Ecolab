import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class LoginBusinessDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  busiKey!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  reportMatch4!: string;
}