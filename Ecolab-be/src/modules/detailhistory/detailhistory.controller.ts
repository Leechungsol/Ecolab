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
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
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
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("actionImageFile"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Save action contents and action image" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        mbusiKey: { type: "number", example: 12 },
        detailKey: { type: "number", example: 101 },
        actionContents: { type: "string", example: "조치 완료하였습니다." },
        actionImageFile: {
          type: "string",
          format: "binary",
        },
      },
      required: ["mbusiKey", "detailKey"],
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        detailKey: 101,
      },
    },
  })
  async save(
    @Body() dto: SaveDetailHistoryDto,
    @UploadedFile() actionImageFile?: any
  ) {
    return await this.detailHistoryService.saveDetailHistory(
      dto,
      actionImageFile
    );
  }
}