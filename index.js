var express = require("express");
var app = express();
var port = process.env.PORT || 3700;

// Set view of '/' end point
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

// use our public/chat.js file as listener
app.use(express.static(__dirname + '/public'));

// Set port
var server = app.listen(port, function () {
    console.log('Node.js listening on port ' + port);
});

var io = require('socket.io')(server);

// Set up socket connection
io.on('connection', function (socket) {
    // Emit a welcome message to the newly connected client
    socket.emit('message', { message: 'Welcome to the Real Time Web Chat' });
    
    // Broadcast message to all clients when a new client connects
    socket.broadcast.emit('message', { message: 'A new user has joined the chat' });
    
    // Listen for messages from clients and broadcast them to all clients
    socket.on('send', function (data) {
        io.emit('message', data);
    });
});
