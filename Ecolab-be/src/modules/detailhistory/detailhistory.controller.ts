import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { DetailHistoryService } from "./detailhistory.service";
import { SaveDetailHistoryDto } from "./dto/save-detailhistory.dto";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";

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

  @Get("/image/detail/:detailKey")
  @ApiOperation({ summary: "Detail image" })
  async getDetailImage(
    @Param("detailKey") detailKey: number,
    @Res() res: Response
  ) {
    const image = await this.detailHistoryService.getDetailImage(
      Number(detailKey)
    );

    res.setHeader("Content-Type", image.contentType);
    res.setHeader("Cache-Control", "no-store");

    return res.send(image.buffer);
  }

  @Get("/image/action/:detailKey")
  @ApiOperation({ summary: "Action image" })
  async getActionImage(
    @Param("detailKey") detailKey: number,
    @Res() res: Response
  ) {
    const image = await this.detailHistoryService.getActionImage(
      Number(detailKey)
    );

    res.setHeader("Content-Type", image.contentType);
    res.setHeader("Cache-Control", "no-store");

    return res.send(image.buffer);
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