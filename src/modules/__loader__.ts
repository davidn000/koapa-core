
// koapa.env.ts //
import * as KoapaEnv from '../koapa.env'
// koapa.env.ts //



// Abstracts //
import APIController from "./controller/api-controller";
// End Abstracts //

// Datbase //
import { DatabaseExpressionChainList } from './database/core-database-types';
import { DatabaseExpressionChainState } from './database/core-database-enums';
import CoreDatabase from './database/core-database';
import DatabaseExpressionChain from './database/core-db-expression-chain';
// End Database //

// Error Imports //
import KoapaError from "./errors/koapa-error";
import KoapaJSONResponseError from "./errors/koapa-json-response-error";
// End Error Imports //

// KoapaContext //
import KoapaContext from "./context/koapa-context";
// KoapaContext //

// API Responses //
import KoapaJSONResponse from './api-response/koapa-json-response';
// End API Responses //







// Export Groups //
// We export as groups as well as individual exports.
const Abstracts = {
    APIController,
    KoapaError
};

const Enum = {
    ErrorCode: KoapaEnv.KoapaErrorCode,
    DatabaseExpressionChainState: DatabaseExpressionChainState
};

// Export Groups //






// Default Export //


// Singleton initialization //
const CoreDatabaseInstance = new CoreDatabase() as CoreDatabase;


export {
    Abstracts as Abstracts, // Abstract data types or classes
    Enum as Enum, // All software enum convenieitly grouped
    KoapaEnv as KoapaEnv, // config


    KoapaContext,
    KoapaError as KoapaError,
    KoapaJSONResponseError,
    KoapaJSONResponse,
    APIController as APIController,
    
    
    // Database //
    CoreDatabase as CoreDatabase,
    CoreDatabaseInstance as CoreDatabaseInstance,
    DatabaseExpressionChain as DatabaseExpressionChain,
        // - start db types - //
        // DatabaseExpressionChainList,
        // - end db types - //
    
    // End db //
};

// End Default Export //