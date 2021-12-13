function Blob(x, y, r, PerfectCircle = true) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    var yoff = 0;
  
    this.show = function () {
      fill(255);
      if (PerfectCircle) {
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      } else {
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
        }
        endShape();
        pop();
        yoff += 0.01;
      }
    }
    this.update = function () {
      var mouse = createVector(mouseX, mouseY);
      /*мы идем в направлении вектора, который связывает положение мыши по отношению к положению нашего мяча
      капля остается посередине*/
      mouse.sub(width / 2, height / 2);
      mouse.setMag(5);
      // чтобы смещения имели минимальные ускорения
      this.vel.lerp(mouse, 0.2);
      this.pos.add(this.vel);
    }
    this.eat = function (other) {
      var d = p5.Vector.dist(this.pos, other.pos);
      //если расстояние между двумя каплями меньше, чем радиус одного + радиус другого
      if (d < this.r + other.r) {
        var sum = PI * this.r * this.r + PI * other.r * other.r;
        this.r = sqrt(sum / PI);
        return true;
      } else {
        return false;
      }
    }
  }