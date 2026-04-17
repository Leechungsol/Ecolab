import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { DetailHistoryService } from "./detailhistory.service";
import { SaveDetailHistoryDto } from "./dto/save-detailhistory.dto";

@ApiTags("detailhistory")
@Controller("detailhistory")
export class DetailHistoryController {
  constructor(
    private readonly detailHistoryService: DetailHistoryService
  ) {}

  @Get("/:mbusiKey")
  @ApiOperation({ summary: "DetailHistory List" })
  async getList(@Param("mbusiKey") mbusiKey: number) {
    return await this.detailHistoryService.getList(Number(mbusiKey));
  }

  @Get("/:mbusiKey/:detailKey")
  @ApiOperation({ summary: "DetailHistory Detail" })
  async getDetail(
    @Param("mbusiKey") mbusiKey: number,
    @Param("detailKey") detailKey: number
  ) {
    return await this.detailHistoryService.getDetail(
      Number(mbusiKey),
      Number(detailKey)
    );
  }

  @Post("/save")
  @UseInterceptors(FileInterceptor("actionImageFile"))
  @ApiConsumes("multipart/form-data")
  async save(
    @Body(new ValidationPipe()) dto: SaveDetailHistoryDto,
    @UploadedFile() actionImageFile?: any
  ) {
    return await this.detailHistoryService.saveDetailHistory(
      dto,
      actionImageFile
    );
  }
}