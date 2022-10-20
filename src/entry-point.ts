// Loader import //
import { KoapaContext } from './modules/__loader__';
// Loader //

// API Endpoints //
import HelloWorld from './api-endpoints/hello-world';
import SelectAll from './api-endpoints/database-tests/select-all-from-users';
import CreateTableRoute from './api-endpoints/database-tests/create-table';
import WhereClause from './api-endpoints/database-tests/where-clause';
// API Endpoints //

// BunRest imports //
import server from "bunrest";
import { BunResponse } from "bunrest/src/server/response";
import { BunRequest } from "bunrest/src/server/request";
import createUser from './api-endpoints/database-tests/create-user';
// End BunRest Imports //

const app = server();





// API Routes //

app.get('/', (request:BunRequest, response:BunResponse) => {
    const kc = new KoapaContext(request, response, HelloWorld);

    // Events for logging.
    // kc.onError((e: Error) => {
    //     // response.status(500).json({message: e.message});
    //     console.log('Event called on error');
    // });
    // kc.onSuccess((response: KoapaContext) => {
    //     console.log("Event called on success");
    // });
});


app.get('/select-all-from-users', (request:BunRequest, response:BunResponse) => {
    const kc = new KoapaContext(request, response, SelectAll);
});

app.get('/create-users-table', (request:BunRequest, response:BunResponse) => {
    const kc = new KoapaContext(request, response, CreateTableRoute);
});

app.get('/create-user', (request:BunRequest, response:BunResponse) => {
    const kc = new KoapaContext(request, response, createUser);
});

app.get('/where-clause', (request:BunRequest, response:BunResponse) => {
    const kc = new KoapaContext(request, response, WhereClause);
});


// API Routes end //




// Listen to port //

app.listen(3000, () => {
    console.log('App is listening on port 3000');
});

// Listen to port //