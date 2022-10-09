export default abstract class APIController 
{
    protected abstract onRequest(ctx:any):void;

    public sendReqeust(ctx:any):void {
        this.onRequest(ctx);
    }
    // ...
}
