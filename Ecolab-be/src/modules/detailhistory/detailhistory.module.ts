import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetailHistoryController } from "./detailhistory.controller";
import { DetailHistoryService } from "./detailhistory.service";
import { DetailHistoryRepository } from "./detailhistory.repository";
import { DetailHistoryEntity } from "../../entities/detailhistory.entity";
import { DetailImageEntity } from "../../entities/detailimage.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailHistoryEntity, DetailImageEntity]),
  ],
  controllers: [DetailHistoryController],
  providers: [DetailHistoryService, DetailHistoryRepository],
  exports: [DetailHistoryService],
})
export class DetailHistoryModule {}