import { ApiProperty } from "@nestjs/swagger";

export class DetailHistoryListDto {
  @ApiProperty()
  detailKey!: number;

  @ApiProperty({ required: false })
  detailContents?: string;

  @ApiProperty({ required: false })
  actionContents?: string;
}