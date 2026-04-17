import * as winston from "winston";
import * as chalk from "chalk";
import { Logger, LoggerOptions } from "winston";
import "winston-daily-rotate-file";

// 가장 안전한 방식: require 사용
const PrettyError = require("pretty-error");

export class LoggerService {
  private readonly logger: Logger;
  private readonly prettyError: any;

  public static loggerOptions?: LoggerOptions = {
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "woori-be-%DATE%.log",
        dirname: "logs",
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxFiles: "14d",
        maxSize: "20m",
      }),
    ],
  };

  constructor(private context: string) {
    // 1. Winston 초기화 (as any 제거하고 안전하게)
    this.logger = winston.createLogger(LoggerService.loggerOptions || {
      transports: [new winston.transports.Console()]
    });

    // 2. PrettyError 초기화 (방어 코드 추가)
    try {
      this.prettyError = new PrettyError();
      this.prettyError.skipNodeFiles();
      this.prettyError.skipPackage("express", "@nestjs/common", "@nestjs/core");
    } catch (e) {
      console.error("PrettyError initialization failed:", e);
    }
  }
  get Logger(): Logger {
    return this.logger;
  }
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options;
  }
  log(message: any): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formattedLog("info", message);
  }
  error(message: any, trace?: any): void {
    const currentDate = new Date();
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || "trace not provided !"})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formattedLog("error", message, trace);
  }
  warn(message: any): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formattedLog("warn", message);
  }
  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options);
  }
  // this method just for printing a cool log in your terminal , using chalk
  private formattedLog(level: string, message: any, error?: any): void {
    let result = "";
    const color = chalk;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const messageData = JSON.stringify(message);

    switch (level) {
      case "info":
        result = `[${color.blue("INFO")}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${messageData}`;
        break;
      case "error":
        result = `[${color.red("ERR")}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${messageData} -> ${error}`;
        break;
      case "warn":
        result = `[${color.yellow("WARN")}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${messageData}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
}
