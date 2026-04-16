import { ApiProperty } from "@nestjs/swagger";

export class BusinessDto {
  @ApiProperty()
  busiKey: number;

  @ApiProperty()
  busiName: string;

  @ApiProperty()
  reportNumber: string;
}