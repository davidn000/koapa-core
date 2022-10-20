import server from "bunrest";



const app = server();
app.get('/', (request, response) => {
    response.status(200).json({message:"hello world!"});
});
app.get('/examples', (request, response) => {
    const x = new Buffer('POST').toString('base64');
    response.status(500).json({message: x});
});

app.listen(4000, () => {
    console.log('App is listening on port 4000');
});

