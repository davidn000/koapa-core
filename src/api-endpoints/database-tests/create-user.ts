import Koapa from '..';

class CreateUser extends Koapa.APIController {
    public onRequest(ctx: Koapa.KoapaContext): void {
        const query = (ctx.request.query)
        
        if (!query.username || !query.password || !query.email) {
            ctx.response({
                message: 'Missing parameters',
                status: 400,
            }, 400);
        }

        const dbData = ctx.database.insert('users', {
            username: query.username,
            password: query.password,
            email: query.email,
        });

        ctx.response({
            data: dbData,
            status: 200,
        }, 200)
    }
}

export default new CreateUser();