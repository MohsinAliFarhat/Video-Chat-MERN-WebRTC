const socket = (server) => {

    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    let users = [];

    const addUser = (userId, socketId) => {
        !users.some(user => user.userId === userId) &&
            users.push({ userId, socketId });
    }

    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId)
    }

    const getUser = (userId) => {
        return users.find(user => user.userId === userId);
    }


    io.on("connection", (socket) => {

        //When a user connects
        socket.emit("me", socket.id);

        socket.on("addUser", (userId) => {
            console.log("Add user: ", userId)
            addUser(userId, socket.id);
            console.log("User connected, users array: ",users);
        });

        //When user disconnects
        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
            removeUser(socket.id);

        }); 


        socket.on("callUser", (data) => {
            const user = getUser(data.username);
            console.log("Data: ",data);
            console.log("User to call: ", user)
            io.to(user.socketId).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
        })

        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        })

    }) 
}

module.exports = socket;