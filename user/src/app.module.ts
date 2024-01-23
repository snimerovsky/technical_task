import {Module} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {APP_FILTER} from "@nestjs/core";
import {ExceptionsFilter} from "./commons/exceptions/exceptions.filter";
import {SystemsGlobalModule} from "./modules/systems-global.module";
import {UserModule} from "./modules/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {HealthModule} from "./modules/health.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env'}`,
            isGlobal: true
        }),
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`),
        SystemsGlobalModule, UserModule, HealthModule
    ],
    providers: [
      { provide: APP_FILTER, useClass: ExceptionsFilter },
    ]
})
export class AppModule {}
