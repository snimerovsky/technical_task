import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Transport} from "@nestjs/microservices";
import {Logger} from "@nestjs/common";

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const logger: Logger = new Logger('App');

    const app = await NestFactory.create(AppModule)
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`],
            queue: process.env.QUEUE_USER_NOTIFICATION,
            queueOptions: { durable: false },
        },
    });
    await app.startAllMicroservices();
    await app.listen(PORT, () => logger.log(`Server started on port = ${PORT}`))
}
bootstrap();
