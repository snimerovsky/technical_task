import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as cors from 'cors'
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import {Logger} from "@nestjs/common";

const logStream = fs.createWriteStream('api.log', {
  flags: 'a'
})
async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const logger: Logger = new Logger('App');
    const app = await NestFactory.create(AppModule, {cors: true})

    const config = new DocumentBuilder()
        .setTitle("User service")
        .setDescription("User service Api Documentation")
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.use(cors())

    app.use(morgan('combined', {stream: logStream}))
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '10mb' }));

    await app.listen(PORT, () => logger.log(`Server started on port = ${PORT}`))
}
bootstrap();
