import { Body, Controller, Get, Param, Post, UsePipes } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { FindMonthlyBusinessDto } from "./dto/find-monthlybusiness.dto";
import { MonthlyBusinessDto } from "./dto/monthlybusiness.dto";
import { MonthlyBusinessService } from "./monthlybusiness.service";

@ApiTags("monthlybusiness")
@Controller("monthlybusiness")
export class MonthlyBusinessController {
  constructor(
    private readonly monthlyBusinessService: MonthlyBusinessService
  ) {}

  @Get("/:mbusiKey")
  @ApiOperation({ summary: "Get monthly business by mbusiKey" })
  @ApiOkResponse({ type: MonthlyBusinessDto })
  async findByMbusiKey(
    @Param("mbusiKey") mbusiKey: number
  ): Promise<MonthlyBusinessDto> {
    return await this.monthlyBusinessService.findByMbusiKey(Number(mbusiKey));
  }

  @UsePipes(new ValidationPipe())
  @Post("/find")
  @ApiOperation({ summary: "Get monthly business by busiKey and checkYm" })
  @ApiBody({ type: FindMonthlyBusinessDto })
  @ApiOkResponse({ type: MonthlyBusinessDto })
  async findOne(
    @Body() dto: FindMonthlyBusinessDto
  ): Promise<MonthlyBusinessDto> {
    return await this.monthlyBusinessService.findOne(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post("/mbusikey")
  @ApiOperation({ summary: "Get mbusiKey by busiKey and checkYm" })
  @ApiBody({ type: FindMonthlyBusinessDto })
  @ApiOkResponse({ schema: { example: { mbusiKey: 100 } } })
  async findMbusiKey(
    @Body() dto: FindMonthlyBusinessDto
  ): Promise<{ mbusiKey: number }> {
    const mbusiKey = await this.monthlyBusinessService.findMbusiKey(
      dto.busiKey,
      dto.checkYm
    );

    return { mbusiKey };
  }
}