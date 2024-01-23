import {Injectable} from "@nestjs/common";

@Injectable()
export class HelperService {

    getPaginationParameters(limit: string, page: string){
        const limitValue = isNaN(parseInt(limit)) || parseInt(limit) < 0 || parseInt(limit) > 50 ? 5 : Number(limit);
        const pageValue =  isNaN(parseInt(page)) ? 0 : Number(page)
        return { limitValue, skipValue: limitValue * pageValue }
    }
}
