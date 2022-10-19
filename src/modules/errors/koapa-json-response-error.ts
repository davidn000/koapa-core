import { KoapaError, KoapaEnv } from "../__loader__";

export default class KoapaJSONResponseError extends KoapaError {
    constructor(json: {message: string, status: number | KoapaEnv.KoapaErrorCode, details?: any}) {
        super(json);
    }
}