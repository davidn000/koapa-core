import { KoapaJSONResponseError } from "../__loader__";

export default class KoapaJSONResponse {
    private _json: Object;
    private _status: number;
    private minSuccessStatus: number;
    private maxSuccessStatus: number;

    constructor(response: Object, successStatusRange: { min: number, max: number } = { min: 199, max: 300 }) {
        this._json = response;
        this._status = 200;

        this.minSuccessStatus = successStatusRange.min;
        this.maxSuccessStatus = successStatusRange.max;
    }

    private isStatusSuccess(): boolean {
        return this._status >= this.minSuccessStatus && this._status < this.maxSuccessStatus;
    }

    private responseErrorCheck(): void {
        if (!this.isStatusSuccess()) {
            throw new KoapaJSONResponseError({
                message: "Response failed due to status code not being success.",
                status: this._status,
            });
        }
    }

    public get status(): number {
        return this._status;
    }

    public setResponse(response: Object, status: number = 200): KoapaJSONResponse {
        return this.setJSON(response).setStatus(status);
    }
    
    public setJSON(json: Object): KoapaJSONResponse {
        this._json = json;
        return this;
    }

    public setStatus(status: number): KoapaJSONResponse {
        this._status = status; // Change status code
        this.responseErrorCheck(); // Check if status code is in success range
        return this; // Return self
    }

    public error(message: string, status: number): KoapaJSONResponse {
        throw new KoapaJSONResponseError({
            message: message,
            status: status
        });
    }
    
    public success(message:string = null): KoapaJSONResponse 
    {
        return message === null ? new KoapaJSONResponse({}).setStatus(200) : new KoapaJSONResponse({message: message}).setStatus(200);
    }


    public json(): Object {
        return this._json;
    }

    public toString(): string {
        return JSON.stringify(this._json);
    }

    public valueOf(): Object {
        return this._json;
    }

} 