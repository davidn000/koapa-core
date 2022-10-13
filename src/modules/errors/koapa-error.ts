// KoapaError class provides a way to handle errors in a more elegant way.
// each instance of KoapaError has a code, a message, and a status.
import { KoapaEnv } from "../__loader__";

export default class KoapaError extends Error {
    public message: string;
    public status: number | KoapaEnv.KoapaErrorCode;

    constructor(json: {message: string, status: number | KoapaEnv.KoapaErrorCode}) {
        super(json.message);
        this.message = json.message;
        this.status = json.status;
    }

    public json(): Object {
        return {
            message: this.message,
            status: this.status
        };
    }

    public toString(): string {
        return this.message;
    }
    
}