import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorityWebMappingEntity } from "../../entities/authoritywebmapping.entity";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserModule } from "../user/user.module";
import { AuthorityController } from "./authority.controller";
import { AuthorityRepository } from "./authority.repository";
import { AuthorityService } from "./authority.service";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ AuthorityWebMappingEntity ])],
  providers: [AuthorityRepository, AuthorityService],
  controllers: [AuthorityController],
  exports: [AuthorityService],
})
export class AuthorityModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuthorityController);
  }
}
