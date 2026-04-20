import { Injectable, NotFoundException } from "@nestjs/common";
import { DetailHistoryRepository } from "./detailhistory.repository";
import { SaveDetailHistoryDto } from "./dto/save-detailhistory.dto";

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
      hasDetailImage: !!result.DetailImage,
      hasActionImage: !!result.ActionImage,
    };
  }

  async getDetailImage(detailKey: number) {
    const imageBuffer = await this.detailHistoryRepository.findImageBuffer(
      detailKey,
      "1"
    );

    if (!imageBuffer) {
      throw new NotFoundException("점검 이미지가 없습니다.");
    }

    return {
      buffer: imageBuffer,
      contentType: this.getImageContentType(imageBuffer),
    };
  }

  async getActionImage(detailKey: number) {
    const imageBuffer = await this.detailHistoryRepository.findImageBuffer(
      detailKey,
      "2"
    );

    if (!imageBuffer) {
      throw new NotFoundException("조치 이미지가 없습니다.");
    }

    return {
      buffer: imageBuffer,
      contentType: this.getImageContentType(imageBuffer),
    };
  }

  async saveDetailHistory(
    dto: SaveDetailHistoryDto,
    actionImageFile?: any
  ) {
    const { detailKey, actionContents } = dto;

    await this.detailHistoryRepository.updateActionContents(
      detailKey,
      actionContents ?? ""
    );

    if (dto.deleteActionImage === "Y") {
      await this.detailHistoryRepository.deleteActionImage(detailKey);
    }

    if (actionImageFile) {
      await this.detailHistoryRepository.saveActionImage(
        detailKey,
        actionImageFile,
        "business"
      );
    }

    return {
      success: true,
      detailKey,
    };
  }

  private getImageContentType(buffer: Buffer) {
    if (!buffer || buffer.length < 12) {
      return "application/octet-stream";
    }

    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return "image/jpeg";
    }

    // PNG
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "image/png";
    }

    // GIF
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46
    ) {
      return "image/gif";
    }

    // WEBP (RIFF....WEBP)
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return "image/webp";
    }

    // BMP
    if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
      return "image/bmp";
    }

    return "image/jpeg";
  }
}