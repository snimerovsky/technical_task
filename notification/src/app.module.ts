import {Module} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {APP_FILTER} from "@nestjs/core";
import {ExceptionsFilter} from "./commons/exceptions/exceptions.filter";
import {UserModule} from "./modules/user.module";
import {HealthModule} from "./modules/health.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env'}`,
            isGlobal: true
        }),
        UserModule, HealthModule
    ],
    providers: [
        { provide: APP_FILTER, useClass: ExceptionsFilter },
    ]
})
export class AppModule {}
