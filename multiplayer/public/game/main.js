var socket;
var blob;

var blobs = [];
var clients = [];
var cliBLobs = {};
var biggest = [];
var zoom = 1;
var div;
var playerName = localStorage["playerName"];
var skin = localStorage["skin"];
var lastEaten = ""; // id последнего съеденного blob, чтобы не посылать несколько съеденных сигналов с одним и тем же id

const MAPSIZE = 4;
const BALLSIZE = 7;


function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  for(var i =0; i<50; i++) {
    var x = random(-width*MAPSIZE, width*MAPSIZE);
  var y = random(-height*MAPSIZE, height*MAPSIZE);
  blobs.push(new Blob(x, y, BALLSIZE) );
      }
  //текст для отображения самых больших капель
   div = createDiv('').size(100, 100);
  //connection
  // socket = io.connect('http://localhost:3000');
  socket = io();
  // blob = new Blob(random(width*MAPSIZE), random(height*MAPSIZE), random(8, 48), false, playerName, skin);
  
  blob = new Blob(random(-width*MAPSIZE, width*MAPSIZE), random(-height*MAPSIZE, height*MAPSIZE), random(8, 48), false, playerName, skin);
  //данные для отправки на сервер
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    name:playerName,
    img:skin
  }
  socket.emit('start', data);
  //если мы получим сигнал об отключении
  socket.on('forceDisconnect', function(){
    console.log("deco");
    window.location="game_over.html";
    socket.disconnect();
});
  //обновление позиции других клиентов
  socket.on('heartbeat',
    function (data) {
      clients = data;
      // console.log(data);
      //добавил маленькие шары, чтобы поесть
      if(blobs.length<1000) {
      var x = random(-width*MAPSIZE, width*MAPSIZE);
    var y = random(-height*MAPSIZE, height*MAPSIZE);
    blobs.push(new Blob(x, y, BALLSIZE+random(-2,18)) );
      }
    });
  for (var i = 0; i < 50; i++) {
    //мы также создаем частицы за пределами окна, поскольку они перемещаются в соответствии с нашей позицией
    var x = random(-width, width);
    var y = random(-height, height);
    blobs[i] = new Blob(x, y, BALLSIZE);
  }
}

function draw() {

  background(0);
  //мы перемещаем начало нашего холста, чтобы наша капля всегда была в центре
  translate(width / 2, height / 2);
  //сделать эффект масштабирования более чистым
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  //уменьшить масштаб по мере роста нашей капли
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  //для которых начинается с конца, чтобы не было проблем с разделением
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
    if (blob.eat(blobs[i])) {
      blobs.splice(i, 1);
    }
  }
  //отображение других игроков
  for (var i = clients.length - 1; i >= 0; i--) {
    var id = clients[i].id;
    //для каждого клиента в массиве, кроме текущего клиента, который выполняет код (чтобы не раскрывать себя), мы можем проверить его значение в консоли Chrome, набрав socket.id
    if (id !== socket.id) {
      fill(0, 0, 255);
      //мы пытаемся получить blob этого идентификатора для отображения
      try {
        var cliblob = cliBLobs[clients[i].id];
        cliblob.show();
        cliblob.updateOther(clients[i].x,clients[i].y,clients[i].r);
        if (blob.eat(cliblob) && lastEaten != id) {
          socket.emit("eaten",id);
          lastEaten = id;
        }
      }
      catch (error) {
        console.log(clients[i].img);
        cliBLobs[clients[i].id] = new Blob(clients[i].x, clients[i].y, clients[i].r,false,clients[i].name,clients[i].img);
      }

      fill(200,30,0);
      textAlign(CENTER);
      textSize(clients[i].r/3);
      text(clients[i].name, clients[i].x, clients[i].y + clients[i].r);

    }
  }


  blob.show();
  if(mouseIsPressed){
  blob.update();
  }
  blob.constrain(MAPSIZE);
  //5 крупнейших
  biggest = sort2(clients);
  if(clients.length>1) {
    div.html("Classement : <br/>");
    var min = clients.length>6 ? 6 : clients.length ;
  for  (var i=0; i<min; i++) {
    div.html(i+1 + ") "+biggest[min-i-1].name + " <br/>",true);
  }
}
else {
  div.html("Not enought players");
}

    // обновляем позицию
   // данные для отправки на сервер
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  }
  socket.emit('update', data);

}

function sort2(clients2){
  var tab = clients2;
  for(var i = 0; i < tab.length; i++){
    var min = i; 
    for(var j = i+1; j < tab.length; j++){
      if(tab[j].r < tab[min].r){
       //обновить минимальный индекс элемента
       min = j; 
      }
    }
    var tmp = tab[i];
    tab[i] = tab[min];
    tab[min] = tmp;
  }
  return tab;
};