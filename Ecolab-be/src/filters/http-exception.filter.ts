import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";

@Catch(HttpException)
/**
 * An exception filter that handles `HttpException` instances and logs the error.
 *
 * This filter is responsible for catching `HttpException` instances, logging the error, and returning a JSON response with the status code, timestamp, and request path.
 */
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const logger = new LoggerService(exception.name);
    logger.error(request.url, exception.stack);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
