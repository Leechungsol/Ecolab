import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  userID!: string;
  @ApiProperty()
  userName!: string;
  @ApiProperty()
  authority!: number;
}
