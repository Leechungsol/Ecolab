import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SaveDetailHistoryDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  mbusiKey!: number;

  @ApiProperty({ example: 101 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  detailKey!: number;

  @ApiProperty({ example: "조치 완료하였습니다.", required: false })
  @IsOptional()
  @IsString()
  actionContents?: string;

  @ApiProperty({ example: "N", required: false })
  @IsOptional()
  @IsString()
  deleteActionImage?: string;
}