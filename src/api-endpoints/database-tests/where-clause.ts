import Koapa from '..';

class WhereClause extends Koapa.APIController {
    public onRequest(ctx: Koapa.KoapaContext): void {
        const dbData = ctx.database.select('users', ['*'])
        .where((columns)=> {
            console.log(columns
                .username
                .equals('test')
                .and(columns.email)
                .doesNotEquals(columns.id)
                .evalToString());
        });
        ctx.response({
            data:dbData,
            status: 200,
        }, 200)
    }
}

export default new WhereClause();