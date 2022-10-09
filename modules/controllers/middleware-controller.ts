abstract class MiddlewareController {
    abstract onRequest(ctx:any):void;
}

export {MiddlewareController};