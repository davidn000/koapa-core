import { Middleware } from "../modules/__loader__";

class APIRouter extends Middleware.MiddlewareController {
    onRequest(ctx:any):void {
        // ...
    }
    
}

export default new APIRouter();