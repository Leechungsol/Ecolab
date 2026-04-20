import { Injectable, NotFoundException } from "@nestjs/common";
import { DetailHistoryRepository } from "./detailhistory.repository";
import { SaveDetailHistoryDto } from "./dto/save-detailhistory.dto";
import sharp from "sharp";

@Injectable()
export class DetailHistoryService {
  constructor(
    private readonly detailHistoryRepository: DetailHistoryRepository
  ) {}

  async getList(mbusiKey: number) {
    const result = await this.detailHistoryRepository.findList(mbusiKey);

    return result.map((item) => ({
      detailKey: item.DetailKey,
      detailContents: item.DetailContents,
      actionContents: item.ActionContents,
    }));
  }

  async getDetail(mbusiKey: number, detailKey: number) {
    const result = await this.detailHistoryRepository.findDetail(
      mbusiKey,
      detailKey
    );

    if (!result) throw new NotFoundException();

    return {
      mbusiKey: result.MbusiKey,
      detailKey: result.DetailKey,
      detailContents: result.DetailContents,
      actionContents: result.ActionContents,
      detailImage: result.DetailImage
        ? Buffer.from(result.DetailImage).toString("base64")
        : null,
      actionImage: result.ActionImage
        ? Buffer.from(result.ActionImage).toString("base64")
        : null,
    };
  }

  async saveDetailHistory(
    dto: SaveDetailHistoryDto,
    actionImageFile?: Express.Multer.File
  ) {
    const { detailKey, actionContents } = dto;

    console.log("dto:", dto);

    await this.detailHistoryRepository.updateActionContents(
      detailKey,
      actionContents ?? ""
    );

    if (dto.deleteActionImage === "Y") {
      await this.detailHistoryRepository.deleteActionImage(detailKey);
    }

    if (actionImageFile?.buffer) {
      console.log("actionImageFile:", {
        originalname: actionImageFile.originalname,
        mimetype: actionImageFile.mimetype,
        size: actionImageFile.size,
        hasBuffer: !!actionImageFile.buffer,
      });

      const resizedBuffer = await sharp(actionImageFile.buffer)
        .rotate() // 모바일 사진 방향 보정
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toBuffer();

      console.log("resizedBuffer size:", resizedBuffer.length);

      await this.detailHistoryRepository.saveActionImage(
        detailKey,
        resizedBuffer,
        "business"
      );
    }

    return {
      success: true,
      detailKey,
    };
  }
}