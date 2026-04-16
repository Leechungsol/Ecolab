import { Controller, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthorityWebMappingEntity } from "../../entities/authoritywebmapping.entity";
import { UserDto } from "../user/dto/user.dto";
import { User } from "../user/user.decorator";
import { AuthorityService } from "./authority.service";

@ApiBearerAuth()
@ApiTags("authority")
@Controller("authority")
export class AuthorityController {
  constructor(private readonly authorityService: AuthorityService) {}

  @Get("/web-mapping")
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOperation({ summary: "Get Authority web mapping" })
  @ApiResponse({
    status: 200,
    description: "Returns the Authority web mapping",
    type: [AuthorityWebMappingEntity],
  })
  async getAuthorityWebMapping(
    @User() user: UserDto
  ): Promise<AuthorityWebMappingEntity[]> {
    return this.authorityService.getAuthorityWebMapping(user);
  }
}
