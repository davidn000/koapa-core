// To start the server run bun entry-point.ts

import server from "bunrest";
const app = server();

server.get('/runtests', (req, res) => {
    res.status(200).send('Hello World!');
});