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

  /**
   * 목록 조회
   */
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

  /**
   * 상세 조회
   */
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

  /**
   * ActionContents 저장
   */
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

  /**
   * 조치 이미지 저장 (ImageType = '2')
   * 있으면 update, 없으면 insert
   */
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