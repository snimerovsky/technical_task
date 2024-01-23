import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import {Request, Response} from "express";
import * as fs from "fs";

export interface HttpExceptionResponse {
    statusCode: number;
    error: string;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse{
    path: string;
    method: string;
    timeStamp: Date;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {

    private readonly logger: Logger = new Logger('Notification Service')

    catch(exception: unknown, host: ArgumentsHost){
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;

        if(exception instanceof  HttpException){
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMessage = `${(errorResponse as HttpExceptionResponse).error ?? ""} ${exception.message ?? ""} `
        }else if(exception instanceof Error){
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage =  `Critical internal server error occurred!  ${exception?.message}`
        }

        const errorResponse = this.getErrorResponse(status, errorMessage, request);
        const errorLog  = this.getErrorLog(errorResponse, request, exception);
        this.logger.warn(JSON.stringify(errorLog.trim()))
        this.writeErrorLogToFile(errorLog);
        response.status(status).json(errorResponse)

    }

    private getErrorResponse = (status:  HttpStatus, errorMessage: string, request: Request): CustomHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date()
    })

    private getErrorLog = (errorResponse: CustomHttpExceptionResponse, request: Request, exception: unknown) => {
        const { statusCode, error } = errorResponse;
        const { method, url, body } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n
        ${JSON.stringify(errorResponse)}\n
        ${exception instanceof  HttpException ? exception.stack : error}\n
        Body: ${JSON.stringify(body ?? {})} \n\n`

        return errorLog;
    }

    private writeErrorLogToFile = (errorLog: string) => {
        fs.appendFile('error.log', errorLog, 'utf8', (err) => {
            if(err) throw err;
        })
    }
}
