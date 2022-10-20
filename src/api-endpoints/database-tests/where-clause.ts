import Koapa from '..';

class WhereClause extends Koapa.APIController {
    public onRequest(ctx: Koapa.KoapaContext): void {
        const dbData = ctx.database.select('users', ['*'])
        .where((columns) => columns.username.equals('test'));
        ctx.response({
            data:dbData,
            status: 200,
        }, 200)
    }
}

export default new WhereClause();