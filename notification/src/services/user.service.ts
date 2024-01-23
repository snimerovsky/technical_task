import {Injectable} from "@nestjs/common";

@Injectable()
export class UserService {
    userCreated(name: string) {
        console.log(`Welcome ${name}!`)
    }

    userDeleted(name: string) {
        console.log(`User ${name} has been deleted :(`)
    }
}
