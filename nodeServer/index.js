const io = require("socket.io")(8000, {
    cors: { origin: "*" }
});

const users = {};

io.on('connection', socket => {
    socket.on('join-room', ({ name, room }) => {
        users[socket.id] = name;
        socket.join(room);
        socket.to(room).emit('user-joined', name);

        socket.on('send-message', ({ message }) => {
            io.to(room).emit('receive', {
                name: users[socket.id],
                message: message
            });
        });

        socket.on('disconnect', () => {
            socket.to(room).emit('user-left', users[socket.id]);
            delete users[socket.id];
        });
    });
});
