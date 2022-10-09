import { Middleware } from '../__loader__';

abstract class APIController 
{

    abstract onRequest(ctx:any):void;

    private middleware(Middleware:Object):void 
    {
        for (let key in Middleware) 
        {
            // key.
        }
    };

    // ...
}

export {
    APIController
}