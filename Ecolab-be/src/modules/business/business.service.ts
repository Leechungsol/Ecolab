import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import jwt = require("jsonwebtoken");

import { BusinessEntity } from "../../entities/business.entity";
import { LoginBusinessDto } from "./dto/login-business.dto";
import { BusinessDto } from "./dto/business.dto";

@Injectable()
export class BusinessService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>
  ) {}

  /**
   * busiKey로 업체 조회
   */
  async findByBusikey(busiKey: number): Promise<BusinessDto> {
    const business = await this.businessRepository.findOne({
      where: { busiKey },
    });

    if (!business) throw new NotFoundException();

    return this.buildBusinessRO(business);
  }

  /**
   * 외부 업체 로그인
   * busiKey + reportNumber 검증용 4자리
   */
  async findOne({
    busiKey,
    reportMatch4,
  }: LoginBusinessDto): Promise<BusinessDto> {
    console.log("=== business login start ===");
    console.log("input busiKey:", busiKey);
    console.log("input reportMatch4:", reportMatch4);

    const business = await this.businessRepository.findOne({
      where: { busiKey },
    });

    console.log("found business:", business);

    if (!business) {
      console.log("business not found");
      throw new NotFoundException();
    }

    const dbReportMatch4 = this.getReportNumberMatch4(business.reportNumber);

    console.log("db reportNumber:", business.reportNumber);
    console.log("dbReportMatch4:", dbReportMatch4);

    if (dbReportMatch4 !== reportMatch4) {
      console.log("reportMatch4 mismatch");
      throw new NotFoundException();
    }

    console.log("business login success");
    return this.buildBusinessRO(business);
  }

  /**
   * JWT 생성
   * 기존 user service 방식과 동일하게 jsonwebtoken 직접 사용
   */
  public generateJWT(business: BusinessDto) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        user: {
          busiKey: business.busiKey,
          businessName: business.busiName,
          loginType: "BUSINESS",
        },
        exp: exp.getTime() / 1000,
      },
      this.config.get<string>("secret")
    );
  }

  /**
   * REPORTNUMBER에서 검증용 4자리 추출
   * 예: "제 2020-0339860 호" -> "0339"
   *
   * 나중에 규칙 바꾸고 싶으면 이 메소드만 수정하면 됨
   */
  private getReportNumberMatch4(reportNumber: string): string {
    if (!reportNumber) return "";

    const cleaned = reportNumber.replace(/[^0-9\-]/g, "");
    // 예: 2017-0323584

    const parts = cleaned.split("-");
    if (parts.length < 2) return "";

    const backNumber = parts[1]; // 0323584
    if (!backNumber || backNumber.length < 4) return "";

    // 뒤 7자리 중 앞 4자리
    return backNumber.substring(0, 4);
  }

  /**
   * Entity -> DTO
   */
  private buildBusinessRO(business: BusinessEntity): BusinessDto {
    const businessRO = {
      busiKey: business.busiKey,
      busiName: business.busiName,
      reportNumber: business.reportNumber,
    };

    return businessRO;
  }
}