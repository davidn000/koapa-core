import { BunRequest } from "bunrest/src/server/request";
import { BunResponse } from "bunrest/src/server/response";
import { APIController, KoapaJSONResponse, KoapaJSONResponseError, CoreDatabase } from "../__loader__";

export default class KoapaContext {
    public readonly request: BunRequest;
    private controllerResponse: any;
    private readonly bunResponse: BunResponse;
    private readonly _response: KoapaJSONResponse;
    private readonly _database: CoreDatabase = new CoreDatabase();


    constructor(
        bunRequest: BunRequest,
        bunResponse: BunResponse,
        controller: APIController
    ) {
        this.request = bunRequest;
        this._response = new KoapaJSONResponse({});
        this.bunResponse = bunResponse;
        this.controllerResponse = controller.sendReqeust(this);

        if (this.controllerResponse instanceof KoapaJSONResponseError) {
            this.sendError(this.controllerResponse);
        }
    }

    public async onError(callback: (e: Error) => void): Promise<void> {

        if (this.controllerResponse instanceof KoapaJSONResponseError) {
            callback(this.controllerResponse);
        }

    }

    public async onSuccess(callback: (response: KoapaContext) => void): Promise<void> {
        if (!(this.controllerResponse instanceof KoapaJSONResponseError)) {
            callback(this);
        }
    }

    public get database(): CoreDatabase {
        return this._database;
    }

    /**
     * Send JSON object to client
     * @returns KoapaJSONResponse
     */
    public sendResponse(): KoapaJSONResponse {
        const koapaJSONResponseStatus = this._response.status;
        const koapaJSONResponseJSON = this._response.json();
        this.bunResponse.status(koapaJSONResponseStatus).json(koapaJSONResponseJSON);
        return this._response;
    }

    /**
     * Sets KoapaJSONResponse object
     * @param response
     * @returns KoapaJSONResponse
     * @see response
     */
    public setResponse(response: Object, status: number = 200): KoapaContext {
        this._response.setResponse(response, status);
        return this;
    }

    public setBody(body: Object): KoapaContext {
        this._response.setResponse(body);
        return this;
    }

    /**
     * Returns the response interface object
     * @returns KoapaJSONResponse
     */
    public getResponse(): KoapaJSONResponse {
        return this._response;
    }

    /**
     * Set and send response. Will just send response if response parameter is not set.
     * @param response
     * @returns KoapaJSONResponse
     */
    public response(response: Object = this._response.json(), status: number = 200): void {
        this.setResponse(response, status).sendResponse();
    }

    public sendError(koapaJSONResponseError: KoapaJSONResponseError) {
        this.bunResponse.status(koapaJSONResponseError.status).json({
            message: koapaJSONResponseError.message,
            status: koapaJSONResponseError.status
        });
    }


}