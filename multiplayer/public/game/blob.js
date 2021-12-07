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
    
    if(!PerfectCircle) {
      var url = "img/"+skin+".png";
      img = loadImage(url,yes=> {console.log("The image loaded well!")},no=> {skin="None";} );
    }
    this.show = function () {
      fill(colorT[0],colorT[1],colorT[2]);
      if (PerfectCircle) {
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      } else {
        //if we haven't chosen a skin
        if(skin == "None") {
        //мы переделываем эллиптическую форму, но так, чтобы она изменилась
        push();
        translate(this.pos.x, this.pos.y);
        beginShape();
        //форма создается путем соединения точек, нарисованных так, чтобы образовать круг, если мы изменим точки, форма скручивается
        var xoff = 0;
        for (var i = 0; i < TWO_PI; i += 0.1) {
          var offset = map(noise(xoff, yoff), -1, 1, -25, 25);
          var r = this.r + offset;
          var x = r * cos(i);
          var y = r * sin(i);
          vertex(x, y);
          xoff += 0.1;
          //ellipse(x,y,4,4);
        }
        endShape();
        pop();
        yoff += 0.01;
      }
      else {
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      }
    }
    }
    this.update = function () {
      var mouse = createVector(mouseX, mouseY);
        // мы идем в направлении вектора, который связывает положение мыши по отношению к положению нашего мяча
       //mouse.sub(this.pos);
       // как будто мы сделали перевод, чтобы наш blob оставался посередине
      mouse.sub(width / 2, height / 2);
      //вектор будет постоянно иметь скорость 3
      mouse.setMag(5);
      this.vel.lerp(mouse, 0.2);
      this.pos.add(this.vel);
      if(skin == "None") {
      //стрелка для движения
      drawArrow(this.pos, mouse, 200);
      }
      else {
      drawIMG(this.pos,mouse,img,this.r*4);
      }
    }
  
    this.updateOther = function (x,y,r) {
      var newV = createVector(x,y);
      xoff+= 0.01;
      yoff+=0.02;
      //шум плюс или минус случайный от 0 до 1 дает значение от 0 до ширины
      movingAbs = map(noise(xoff),0,1,-10,10);
      movingOrd = map(noise(yoff),0,1,0-10,10);
      console.log(movingAbs + " "+ movingOrd);
      drawIMG(newV,createVector(movingAbs,movingOrd),img,this.r*4);
      this.pos = newV;
      this.r = r;
    }
  
    this.eat = function (other) {
      // чтобы его съесть, капля должна быть больше другой капли
      if (this.r > other.r) {
      var d = p5.Vector.dist(this.pos, other.pos);
      //если расстояние между двумя каплями меньше, чем радиус одного + радиус другого
      if (d < this.r + other.r) {
        //this.r += other.r/5; fonctionne mais y'a mieux
        var sum = PI * this.r * this.r + PI * other.r * other.r;
        this.r = sqrt(sum / PI);
        return true;
      } 
    }
    return false;
    }
    this.constrain = function (MAPSIZE) {
      blob.pos.x = constrain(blob.pos.x, -width*MAPSIZE , width*MAPSIZE );
      blob.pos.y = constrain(blob.pos.y, -height*MAPSIZE, height*MAPSIZE );
    };
  
    function drawIMG(base, vec, img,size) {
      push();
      translate(base.x, base.y);
      rotate(vec.heading());
      translate(vec.mag(), 0);
      image(img,vec.x,vec.y,size,size);
      pop();
    }
    function drawArrow(base, vec, myColor) {
      push();
      stroke(myColor);
      strokeWeight(3);
      fill(myColor);
      translate(base.x, base.y);
      line(0, 0, vec.x, vec.y);
      rotate(vec.heading());
      let arrowSize = 7;
      translate(vec.mag() - arrowSize, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }
  }