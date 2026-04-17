import { ApiProperty } from "@nestjs/swagger";

export class MonthlyBusinessDto {
  @ApiProperty()
  mbusiKey!: number;

  @ApiProperty()
  busiKey!: number;

  @ApiProperty()
  checkYm!: string;

  @ApiProperty()
  isCheck?: boolean;

  @ApiProperty()
  isScore?: boolean;

  @ApiProperty()
  manager?: string;

  @ApiProperty()
  descr?: string;
}