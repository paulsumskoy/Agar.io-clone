var blob;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  blob = new Blob(0, 0, 64, false);
  for (var i = 0; i < 50; i++) {
    //мы также создаем частицы за пределами окна, поскольку они перемещаются в соответствии
    var x = random(-width, width);
    var y = random(-height, height);
    blobs[i] = new Blob(x, y, 16);
  }
}

function draw() {
  background(0);
  //мы перемещаем начало нашего холста, чтобы наша капля всегда была в центре
  translate(width / 2, height / 2);
  var newzoom = 64 / blob.r; //сделать эффект масштабирования более чистым
  zoom = lerp(zoom, newzoom, 0.1);
  //масштабировать, чтобы уменьшить масштаб по мере роста нашей капли
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
    //чтобы не было проблем с разделением
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
    if (blob.eat(blobs[i])) {
      blobs.splice(i, 1);
    }
  }

  blob.show();
  blob.update();

}