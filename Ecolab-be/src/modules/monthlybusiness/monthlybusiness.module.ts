import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonthlyBusinessEntity } from "../../entities/monthlybusiness.entity";
import { MonthlyBusinessController } from "./monthlybusiness.controller";
import { MonthlyBusinessService } from "./monthlybusiness.service";

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyBusinessEntity])],
  controllers: [MonthlyBusinessController],
  providers: [MonthlyBusinessService],
  exports: [MonthlyBusinessService],
})
export class MonthlyBusinessModule {}