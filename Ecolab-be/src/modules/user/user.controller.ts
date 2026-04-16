import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserDto } from "./dto/user.dto";
import { User } from "./user.decorator";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiUnauthorizedResponse()
  @Get("/")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiOkResponse({
    description: "User profile retrieved successfully",
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async findMe(@User() userData: UserDto): Promise<UserDto> {
    return await this.userService.findByUsername(userData.userName);
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  @ApiOperation({ description: "Login" })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: UserDto })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: `${loginUserDto.userID} not found` };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = this.userService.generateJWT(_user);
    const { userID, userName, authority } = _user;
    const user = { userID, token, userName, authority };
    return user;
  }
}
