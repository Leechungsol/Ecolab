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
    actionImageFile?: any
  ) {
    const { detailKey, actionContents } = dto;

    await this.detailHistoryRepository.updateActionContents(
      detailKey,
      actionContents ?? ""
    );

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
}