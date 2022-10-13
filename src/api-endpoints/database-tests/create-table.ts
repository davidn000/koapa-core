import Koapa from '..';

class CreateTable extends Koapa.APIController {
    public onRequest(ctx: Koapa.KoapaContext): void {
        const dbData = ctx.database.createTable('users', [
            {
                name: 'id',
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            {
                name: 'username',
                type: 'TEXT',
                notNull: true,
            },
            {
                name: 'password',
                type: 'TEXT',
                notNull: true,
            },
            {
                name: 'email',
                type: 'TEXT',
                notNull: true,
            },
        ]);
        ctx.response({
            data:dbData,
            status: 200,
        }, 200)
    }
}

export default new CreateTable();