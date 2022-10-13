import Koapa from '..';

class SelectAll extends Koapa.APIController {
    public onRequest(ctx: Koapa.KoapaContext): void {
        const dbData = ctx.database.select('users', ['*']);
        ctx.response({
            data:dbData,
            status: 200,
        }, 200)
    }
}

export default new SelectAll();