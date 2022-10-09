

export namespace Middleware {
    abstract class MiddlewareController {
        abstract onRequest(ctx:any):void;
    }

    export const MiddlewareRoutesDictionary = {

    }
}

// export {MiddlewareController};