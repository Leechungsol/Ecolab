import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FindMonthlyBusinessDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  busiKey!: number;

  @ApiProperty({ example: "2026-04" })
  @IsString()
  @IsNotEmpty()
  checkYm!: string;
}