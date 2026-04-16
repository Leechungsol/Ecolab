import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MonthlyBusinessEntity } from "../../entities/monthlybusiness.entity";
import { FindMonthlyBusinessDto } from "./dto/find-monthlybusiness.dto";
import { MonthlyBusinessDto } from "./dto/monthlybusiness.dto";

@Injectable()
export class MonthlyBusinessService {
  constructor(
    @InjectRepository(MonthlyBusinessEntity)
    private readonly monthlyBusinessRepository: Repository<MonthlyBusinessEntity>
  ) {}

  /**
   * mbusiKey로 월별 업소 1건 조회
   */
  async findByMbusiKey(mbusiKey: number): Promise<MonthlyBusinessDto> {
    const result = await this.monthlyBusinessRepository.findOne({
      where: { mbusiKey },
    });

    if (!result) throw new NotFoundException();

    return this.buildMonthlyBusinessRO(result);
  }

  /**
   * busiKey + checkYm 으로 월별 업소 1건 조회
   */
  async findOne({
    busiKey,
    checkYm,
  }: FindMonthlyBusinessDto): Promise<MonthlyBusinessDto> {
    const result = await this.monthlyBusinessRepository.findOne({
      where: { busiKey, checkYm },
    });

    if (!result) throw new NotFoundException();

    return this.buildMonthlyBusinessRO(result);
  }

  /**
   * busiKey + checkYm 으로 mbusiKey만 반환
   */
  async findMbusiKey(
    busiKey: number,
    checkYm: string
  ): Promise<number> {
    const result = await this.monthlyBusinessRepository.findOne({
      where: { busiKey, checkYm },
    });

    if (!result) throw new NotFoundException();

    return result.mbusiKey;
  }

  /**
   * Entity -> DTO
   */
  private buildMonthlyBusinessRO(
    monthlyBusiness: MonthlyBusinessEntity
  ): MonthlyBusinessDto {
    const monthlyBusinessRO = {
      mbusiKey: monthlyBusiness.mbusiKey,
      busiKey: monthlyBusiness.busiKey,
      checkYm: monthlyBusiness.checkYm,
      isCheck: monthlyBusiness.isCheck,
      isScore: monthlyBusiness.isScore,
      manager: monthlyBusiness.manager,
      descr: monthlyBusiness.descr,
    };

    return monthlyBusinessRO;
  }
}