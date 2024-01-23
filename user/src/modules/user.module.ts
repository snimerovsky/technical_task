import {Module} from "@nestjs/common";
import {UserService} from "../services/user.service";
import {UserController} from "../controllers/user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schemas/user.schema";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ClientsModule.registerAsync([
            {
                name: 'NOTIFICATION_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST')}`],
                        queue: configService.get('QUEUE_USER_NOTIFICATION'),
                        queueOptions: {durable: false},
                    },
                }),
                inject: [ConfigService],
            },
        ])
    ],
    exports: [UserService]
})
export class UserModule {}
