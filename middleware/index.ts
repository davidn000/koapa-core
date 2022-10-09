// Middleware Init //

import { KoapaConfig } from "../modules/__loader__";

export function InitMiddleware() {
    const fs = require('fs')
    fs.readdirSync(KoapaConfig.MiddlewareRoutesLocation).forEach((file:string) => {
        console.log(file);
        // Middleware.MiddlewareRoutesDictionary[file] = require(__dirname + KoapaConfig.MiddlewareRoutesLocation + '/' + file);
    });
    
}