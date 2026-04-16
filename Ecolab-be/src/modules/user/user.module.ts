import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserInfoEntity } from "../../entities/userinfo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserInfoEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "user", method: RequestMethod.GET },
        { path: "user", method: RequestMethod.PUT }
      );
  }
}
