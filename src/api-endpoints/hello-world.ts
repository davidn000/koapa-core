import Koapa from "./"

class HelloWorld extends Koapa.APIController {
    protected onRequest(ctx: Koapa.KoapaContext): void{
        ctx.response({message: "Hello World"});
    }
}

export default new HelloWorld();