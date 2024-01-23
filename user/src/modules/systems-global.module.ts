import {Global, Module} from "@nestjs/common";
import {HelperService} from "../services/helper.service";

@Global()
@Module({
    providers: [
        HelperService
    ],
    exports: [
        HelperService,
    ]
})
export class SystemsGlobalModule {}
