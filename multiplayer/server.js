// создаем веб-сервер
var express = require('express');
var app = express();
const port = process.env.PORT || 8000; //il récupère le port sois dans la variable d'environnement, sois prend 8000
var server = app.listen(port);
app.use(express.static('public'));
console.log(`server started on PORT ${port}`);

// взаимодействие с клиентом
var socket = require('socket.io');
var io = socket(server);
// событие при новом подключении
io.sockets.on('connection', newConnection);

// цикл, который отправляет данные каждого клиента всем
setInterval(heartbeat, 50);

function heartbeat() {
    io.sockets.emit('heartbeat',clients);
}

// массив для каждого клиента, который подключается к серверу
var clients = [];

function Blob(id, x, y, r,name,img) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name,
    this.img = img;
}

function newConnection(socket) {
    console.log("New client :" + socket.id);
     soCid = socket.id;
     var once = true;
    
    // в случае отключения
    socket.on("disconnect", function (msg) {
    console.log("The client is gone :" + soCid + " because :" + msg );
    });
    socket.on('mouse', mouseMsg);
    socket.on('start', starting);
    socket.on('update', updateData);
    socket.on('eaten', eatBlob);
    // отправляем данные всем клиентам
    function mouseMsg(data) {
        socket.broadcast.emit('mouse', clients);
        console.log(data);
    }
    // добавляем большой двоичный объект в таблицу клиентов
    function starting(data) {
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r + " "+data.name + " "+data.img);
        var blob = new Blob(socket.id, data.x, data.y, data.r,data.name, data.img);
        clients.push(blob);
    }
    // обновляем позиции игроков
    function updateData(data) {
        var blob;
        // простой метод, но не оптимизированный, создаем хеш-карту, обратный маршрут, если мы когда-нибудь удалим клиента
        for (var i = clients.length-1; i >=0; i--) {
            if (socket.id == clients[i].id) {
                blob = clients[i];
                try {
                    blob.x = data.x;
                    blob.y = data.y;
                    blob.r = data.r;
                    }
                    catch (e){
                        console.error(e);
                    }
            }
        }
        
    }
    // обновляем позиции игроков
    function eatBlob(id) {
        for (var i = clients.length-1; i >=0; i--) {
            if (id == clients[i].id && once ==true) {
                console.log("Disconnection from : "+clients[i].name + " "+id);
                io.to(id).emit('forceDisconnect');
                clients.splice(clients[id], 1);
                once = false;
            }
        }
         once = true;
    }
}