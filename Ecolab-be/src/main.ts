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
}
bootstrap();
