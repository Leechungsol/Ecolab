import { ApiProperty } from "@nestjs/swagger";

export class DetailHistoryDetailDto {
  @ApiProperty()
  mbusiKey!: number;

  @ApiProperty()
  detailKey!: number;

  @ApiProperty({ required: false })
  detailContents?: string;

  @ApiProperty({ required: false })
  actionContents?: string;

  @ApiProperty({ required: false })
  detailImage?: string;

  @ApiProperty({ required: false })
  actionImage?: string;
}