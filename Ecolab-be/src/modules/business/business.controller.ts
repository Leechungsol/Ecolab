import { Body, Controller, Get, Param, Post, UsePipes } from "@nestjs/common";
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
import { LoginBusinessDto } from "./dto/login-business.dto";
import { BusinessDto } from "./dto/business.dto";
import { Business } from "./business.decorator";
import { BusinessService } from "./business.service";

@ApiBearerAuth()
@ApiTags("business")
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiUnauthorizedResponse()
  @Get("/:busiKey")
  @ApiOperation({ summary: "Get business by busiKey" })
  @ApiOkResponse({
    description: "Business retrieved successfully",
    type: BusinessDto,
  })
  async findByBusiKey(@Param("busiKey") busiKey: number): Promise<BusinessDto> {
    return await this.businessService.findByBusikey(Number(busiKey));
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  @ApiOperation({ description: "Business Login" })
  @ApiBody({ type: LoginBusinessDto })
  @ApiOkResponse({ type: BusinessDto })
  async login(@Body() loginBusinessDto: LoginBusinessDto): Promise<BusinessDto> {
    const _business = await this.businessService.findOne(loginBusinessDto);

    const errors = { Business: `Business authentication failed` };
    if (!_business) throw new HttpException({ errors }, 401);

    const token = this.businessService.generateJWT(_business);
    const { busiKey, busiName, reportNumber } = _business;

    const business = { busiKey, token, busiName, reportNumber };
    return business;
  }

  @ApiUnauthorizedResponse()
  @Get("/")
  @ApiOperation({ summary: "Get current business profile" })
  @ApiOkResponse({
    description: "Business profile retrieved successfully",
    type: BusinessDto,
  })
  async me(@Business() businessData: BusinessDto): Promise<BusinessDto> {
    return await this.businessService.findByBusikey(businessData.busiKey);
  }
}