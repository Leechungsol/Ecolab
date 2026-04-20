import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DetailHistoryEntity } from "../../entities/detailhistory.entity";
import { DetailImageEntity } from "../../entities/detailimage.entity";

@Injectable()
export class DetailHistoryRepository {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(DetailHistoryEntity)
    private readonly detailHistoryRepository: Repository<DetailHistoryEntity>,

    @InjectRepository(DetailImageEntity)
    private readonly detailImageRepository: Repository<DetailImageEntity>
  ) {}

  async findList(mbusiKey: number) {
    return await this.dataSource.query(
      `
      SELECT
          DetailKey,
          DetailContents,
          ActionContents
      FROM ViewDetailHistory
      WHERE MbusiKey = @0
      ORDER BY DetailKey
      `,
      [mbusiKey]
    );
  }

  async findDetail(mbusiKey: number, detailKey: number) {
    const result = await this.dataSource.query(
      `
      SELECT
          MbusiKey,
          DetailKey,
          DetailContents,
          ActionContents,
          DetailImage,
          ActionImage
      FROM ViewDetailHistory
      WHERE MbusiKey = @0
        AND DetailKey = @1
      `,
      [mbusiKey, detailKey]
    );

    return result?.[0];
  }

  async findImageBuffer(detailKey: number, imageType: "1" | "2") {
    const image = await this.detailImageRepository.findOne({
      where: {
        detailKey,
        imageType,
      },
    });

    return image?.image ?? null;
  }

  async updateActionContents(detailKey: number, actionContents: string) {
    const detailHistory = await this.detailHistoryRepository.findOne({
      where: { detailKey },
    });

    if (!detailHistory) {
      throw new NotFoundException();
    }

    detailHistory.actionContents = actionContents ?? "";

    return await this.detailHistoryRepository.save(detailHistory);
  }

  async saveActionImage(
    detailKey: number,
    file: any,
    userId = "business"
  ) {
    if (!file) return null;

    const exists = await this.detailImageRepository.findOne({
      where: {
        detailKey,
        imageType: "2",
      },
    });

    if (exists) {
      exists.image = file.buffer;
      exists.lastUpdateID = userId;
      exists.lastUpdateDtm = new Date();

      return await this.detailImageRepository.save(exists);
    }

    const newImage = this.detailImageRepository.create({
      detailKey,
      image: file.buffer,
      imageType: "2",
      createID: userId,
      createDtm: new Date(),
      lastUpdateID: userId,
      lastUpdateDtm: new Date(),
    });

    return await this.detailImageRepository.save(newImage);
  }

  async deleteActionImage(detailKey: number) {
    const exists = await this.detailImageRepository.findOne({
      where: {
        detailKey,
        imageType: "2",
      },
    });

    if (!exists) return null;

    return await this.detailImageRepository.remove(exists);
  }
}