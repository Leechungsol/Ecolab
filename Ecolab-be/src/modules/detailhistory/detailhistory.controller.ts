import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
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
  @UseInterceptors(
    FileInterceptor("actionImageFile", {
      storage: memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype?.startsWith("image/")) {
          return cb(
            new BadRequestException("이미지 파일만 업로드할 수 있습니다."),
            false
          );
        }

        cb(null, true);
      },
    })
  )
  @ApiConsumes("multipart/form-data")
  async save(
    @Body(new ValidationPipe()) dto: SaveDetailHistoryDto,
    @UploadedFile() actionImageFile?: Express.Multer.File
  ) {
    return await this.detailHistoryService.saveDetailHistory(
      dto,
      actionImageFile
    );
  }
}