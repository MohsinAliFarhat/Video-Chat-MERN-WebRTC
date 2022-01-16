const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT||5000;
require("./socket.js")(server);

app.get("/",(req,res)=>{
    res.send("Mohsin-Meets backend working!")
})

server.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
})