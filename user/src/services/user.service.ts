import {HttpException, HttpStatus, Inject, Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, USER_QUEUE_MESSAGE_TYPE} from "../schemas/user.schema";
import {Model} from "mongoose";
import {CreateUserDto} from "../schemas/dto/create/create-user.dto";
import {validateEmail} from "../commons/validation/validate.email";
import {UpdateUserDto} from "../schemas/dto/update/update-user.dto";
import {QueryPaginationRequest} from "../schemas/request/query-pagination.request";
import {HelperService} from "./helper.service";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger('User Service');

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
        private helperService: HelperService
    ){
        this.notificationClient.connect()
            .then(() => this.logger.log('Notification client is connected'))
            .catch(error => this.logger.error(`Error with notification client: ${error}`))
    }

    async createUser(dto: CreateUserDto) {
        await this.validateCreateUserData(dto)
        const user = await this.create(dto)
        this.notificationClient.send(USER_QUEUE_MESSAGE_TYPE.USER_CREATED, {name: user.name}).subscribe()
        return user
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.getUserById(id)
        await this.validateUpdateUserData(user, dto)
        await user.updateOne({
            name: dto.name,
            email: dto.email
        })
        return {success: true}
    }

    async deleteUser(id: string) {
        const user = await this.getUserById(id)
        await user.deleteOne()
        this.notificationClient.send(USER_QUEUE_MESSAGE_TYPE.USER_DELETED, {name: user.name}).subscribe()
        return {success: true}
    }

    async getUsersList(query: QueryPaginationRequest) {
        const { limitValue, skipValue } = this.helperService.getPaginationParameters(query?.limit, query?.page);
        return this.userModel.find().limit(limitValue).skip(skipValue)
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id)
        if (!user) throw new HttpException(`User with id ${id} was not found`, HttpStatus.NOT_FOUND)
        return user
    }

    private async create(dto: CreateUserDto){
        return await this.userModel.create({name: dto.name, email: dto.email})
    }

    private async getUserByEmail(email: string) {
        return this.userModel.findOne({email})
    }

    private async validateCreateUserData(dto: CreateUserDto) {
        this.validateUserName(dto?.name)
        this.validateUserEmail(dto?.email)
        await this.checkIfUserExists(dto.email)
    }

    private async validateUpdateUserData(user: User, dto: UpdateUserDto) {
        this.validateUserName(dto?.name)
        this.validateUserEmail(dto?.email)
        if (dto.email !== user.email) await this.checkIfUserExists(dto.email)
    }

    private validateUserName(name: string){
        if(!name) throw new HttpException('Name is required', HttpStatus.BAD_REQUEST)
        if(name.length > 255) throw new HttpException(`Name must be up to 255 length`, HttpStatus.BAD_REQUEST)
    }

    private validateUserEmail(email: string){
        if(!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
        if(!validateEmail(email)) throw new HttpException(`Incorrect email format`, HttpStatus.BAD_REQUEST)
    }

    private async checkIfUserExists(email: string) {
        const user = await this.getUserByEmail(email)
        if (user) throw new HttpException(`User with email ${email} already exists`, HttpStatus.CONFLICT)
    }
}
