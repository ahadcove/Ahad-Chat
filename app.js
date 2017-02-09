var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
// var server = require('http').createServer(app);
// var io = require('socket.io')(serv, {});
var io = require('socket.io').listen(server);

//Start server - env.port will get whatever heroku or we sends back
var port = process.env.PORT || 8080;
server.listen(port);

console.log("Server Started on port " + port);
var root = path.join(path.resolve(__dirname, '/'));

//Default Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
    // res.sendFile(path.join(root, '/index.html'));
})
app.get('/message', function(req, res) {
    res.redirect('/');
});

//Static Folder
// app.use(express.static('assets'));
app.use('/', express.static(__dirname + '/dist'));


//Keep a list of sockets
var roomList = {
    0: { users: [] },
    1: { users: [] },
    2: { users: [] },
    3: { users: [] },
    4: { users: [] },
    5: { users: [] },
    6: { users: [] },
    7: { users: [] },
    8: { users: [] },
    9: { users: [] },
    10: { users: [] },
    11: { users: [] },
    12: { users: [] },
    13: { users: [] },
    14: { users: [] },
    15: { users: [] },
    16: { users: [] },
    17: { users: [] },
    18: { users: [] },
    19: { users: [] },
    20: { users: [] }
};
// var users=[];
var connections = [];
var messages = [];
// var SOCKET_LIST = {};

function updateUsernames(room) {
    io.sockets.in(room).emit('get users', (roomList[room].users));
    // for(i=0;i<users.length;i++){
    //   console.log(users[i]);
    // }
}

function init() {
    io.sockets.emit('get init', (users));
}

//Listen for connection
io.sockets.on('connection', (socket) => {
    var glob;
    var mySock;
    connections.push(socket);
    console.log(`Connected: ${socket.id} and ${connections.length} are online`);

    //New User - Calls back to client if true or false
    socket.on('new user', (data, cb) => {
        socket.join(data.room);
        var room = data.room;
        socket.username = data.name;
        socket.room = data.room;
        var pack = { username: socket.username, sock: socket.id };
        // socket.emit('take id')
        console.log("New User: " + socket.username + " In Room: " + socket.room);
        // roomList.${room}.users.push(pack);
        glob = roomList[socket.room].users;
        glob.push(pack);
        console.log("Glob Length is " + glob.length);
        mySock = pack;
        updateUsernames(room);
        // init();
        cb(true);
    });

    //  socket.on('chat', function (data) {
    //     io.sockets.socket(data.clientid).emit('chat', {
    //         msg: data.msg,
    //         senderid : socket.id
    //     });
    // });


    function printGlob(state) {
        switch (state) {
            case 1:
                console.log("Before Disconnect:");
                break;
            case 2:
                console.log("After Disconnect:");
                break;
        }
        for (var i = 0; i < glob.length; i++) {
            console.log(glob[i].username);
        }

    }

    //Disconnect
    socket.on('disconnect', (data) => {

        if (glob) {
            printGlob(1);
            var find = glob.findIndex(x => x.sock == socket.id);
            console.log("Found: " + find);
            if (find >= 0)
                glob.splice(glob.indexOf(find, 1), 1);
            printGlob(2);
            console.log("Glob Length is " + glob.length);
            if (glob.length > 0)
                updateUsernames(socket.room);
        }
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} are online`);

    });

    //Send Message
    socket.on('send message', (data) => {
        console.log(`Sending Room Msg: ${data}`);
        io.sockets.in(socket.room).emit('new message', { name: socket.username, msg: data });
    });

    //Broadcast to One
    socket.on('chat message', (pack) => {
        console.log(`Sending Chat Msg to ${pack.chatSock.username}: ${pack.msg}`);
        socket.broadcast.to(pack.chatSock.sock).emit('receive chat', { chatSock: mySock, msg: pack.msg });
    });

});
