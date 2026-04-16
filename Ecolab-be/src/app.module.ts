import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import configuration from "./config/configuration";
import { UserModule } from "./modules/user/user.module";
import { AuthorityModule } from "./modules/authority/authority.module";
import { BusinessModule } from "./modules/business/business.module";
import { MonthlyBusinessModule } from "./modules/monthlybusiness/monthlybusiness.module";
import { DetailHistoryModule } from "./modules/detailhistory/detailhistory.module";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";

const env = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !env ? ".env" : `.env.${env}`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mssql",
        host: configService.get<string>("database.host"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        entities: [__dirname + "/entities/*{.ts,.js}"],
        synchronize: false,
        port: configService.get<number>("database.port"),
        options: {
          encrypt: false,
        },
        logging: true,
        migrationsRun: false,
      }),
      async dataSourceFactory(options){
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthorityModule,
    BusinessModule,
    MonthlyBusinessModule,
    DetailHistoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
