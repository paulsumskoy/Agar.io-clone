function Blob(x, y, r, PerfectCircle = true,name ="nobody", skin) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    this.name = name;
    this.skin = skin;
    var yoff = 0;
    var img;
    var colorT = [random(255),random(255),random(40,200)];
    var movingAbs =0, movingOrd =0, xoff = random(0,100), yoff = random(1000,10000);
}