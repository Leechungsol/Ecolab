import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LoggerService } from "./logger/logger.service";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import {
  initializeTransactionalContext,
  StorageDriver,
} from "typeorm-transactional";

async function bootstrap() {

  try{

    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const appOptions = {
    cors: true,
    logger: new LoggerService("Main"),
    abortOnError: true,
  };
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix("api");

  const options = new DocumentBuilder()
    .setTitle("Woori App")
    .setDescription("Woori API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/docs", app, document);
  await app.listen(3000);

  }catch (error) {
    // 여기서 찍히는 로그가 진짜 원인입니다!
    console.error("❌ NestJS 초기화 에러 발생:");
    console.error(error); 
    process.exit(1);
  }
  
}
bootstrap();
