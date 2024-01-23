import {Controller} from "@nestjs/common";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {UserService} from "../services/user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @MessagePattern('user_created')
    public async userCreated(@Payload() data: any) {
        return this.userService.userCreated(data?.name);
    }

    @MessagePattern('user_deleted')
    public async userDeleted(@Payload() data: any) {
        return this.userService.userDeleted(data?.name);
    }
}
