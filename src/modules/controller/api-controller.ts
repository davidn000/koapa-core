import { KoapaJSONResponseError, KoapaContext } from "../__loader__";


export default abstract class APIController 
{
    protected abstract onRequest(ctx: KoapaContext): void;

    public sendReqeust(ctx:KoapaContext): void | KoapaJSONResponseError {
        try {
            return this.onRequest(ctx);
        }catch (e) {
            // Handle error //
            return this.handleRequestError(e);
        }
    }

    private handleRequestError(e: any): KoapaJSONResponseError {
        console.warn(e);
        return new KoapaJSONResponseError({
            message: e.message,
            status: e.status,
            details: e.details ?? {},
        });
    }
    // ...
}
