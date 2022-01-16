const socket = (server) => {

    const io = require('socket.io')(server,{
        cors: {
            origin:"*",
            methods: ["GET","POST"]
        }
    });

    io.on("connection", (socket) => {

        //When a user connects
        socket.emit("me", socket.id);

        //When user disconnects
        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
        });


        socket.on("callUser", (data) => {
            io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
        })

        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        })

    })
}

module.exports = socket;