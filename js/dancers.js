var Dancers = [];
var ClickDancers = [];
var Halftones = [];
var canvParent;
var canv;

function setup() {
  canv = createCanvas(windowWidth, windowHeight);
  canvParent = document.getElementById("canvParent");
  canv.parent(canvParent);
  for (i=0;i<10;i++){
  Dancers[i] = new Dancer(random(width*0.33, width*0.66), 
                          random(height*0.33, height*0.66), 
                          random(0, 1), 
                          random(3, 10), 
                          new p5.Vector(random(-1, 1), random(-1, 1)),
                          color(252, 135, 107),
                          false,
                          i);
  }

  for (j=0;j<Dancers.length;j++){
    Dancers[j].learnOthers(Dancers);
  }
}

function draw() {
  // background(255);
  clear();
  
  // for (i=10;i<width;i+=10){
  //   for (j=10;j<height;j+=10){
  //     strokeWeight(3);
  //     point(i, j);
  //   }
  // }
  for (i=0;i<2;i++){
    Dancers[i].show();
    Dancers[i].go();
    Dancers[i].changeDir();
  }

  for (i=2;i<Dancers.length;i++){
    Dancers[i].show();
    Dancers[i].go();
    Dancers[i].changeDir();
  }

  for (j=0;j<ClickDancers.length;j++){
    ClickDancers[j].show();
    ClickDancers[j].go();
    ClickDancers[j].changeDir();
  }

  // push();
  //   noFill();
  //   stroke(0);
  //   beginShape();
  //     vertex(mouseX, mouseY);
  //     bezierVertex(Dancers[1].pos.x, Dancers[1].pos.y,
  //                 Dancers[0].pos.x, Dancers[0].pos.y,
  //                 mouseX, mouseY);
  //   endShape();
  // pop();
  
}

var Halftone = function(_x, _y){
  this.pos = new p5.Vector(_x, _y);
  this.weight = 2;

  this.show = function(){
    push();
      translate(this.pos.x, this.pos.y);
      strokeWeight(this.weight);
      stroke(0);
      point(this.pos.x, this.pos.y);
    pop();

    // if (this.pos.dist(new p5.Vector(mouseX, mouseY)) < 100){
    //   this.weight = 10;
    // } else {
    //   this.weight = 2;
    // }
  };
};

var Dancer = function(_x, _y, _r, _n, _dir, _col, _type, _ind){
  this.pos = new p5.Vector(_x, _y);
  this.dir = _dir.normalize();
  this.mult = 1;
  this.r = _r;
  this.n = _n;
  this.clickType = _type;
  if (!this.clickType){
    this.rLerped = lerp((width+height)*0.25, (width+height)*0.3, this.r);
  } else {
    this.rLerped = lerp((width+height)*0.1, (width+height)*0.2, this.r);
  }
  this.ind = _ind;
  this.counter = 0;
  this.otherDancers = [];
  this.g = random(-0.00005, -0.005);
  if (this.ind%2){
    this.rotate = random(1500, 2000);
  } else {
    this.rotate = random(-1500, -2000);
  }
  this.col = color(random(red(_col), red(_col) + 20), random(green(_col), green(_col) + 20), random(blue(_col), blue(_col) + 20));
  
  this.go = function(){
      this.pos.add(this.dir.mult(this.mult));
  };
  
  this.show = function(){
    this.changeShape();
      push();
        translate(this.pos.x + (sin(this.counter*360)*100), this.pos.y + (cos(this.counter*360)*100));
        fill(this.col);
        noStroke();
        polygon(0, 0, this.rLerped, this.n);
        
      pop();

      this.counter = (this.counter+0.00001)%2;
  };

  this.learnOthers = function(_array){
    this.otherDancers = _array.map(x=>x);
    this.otherDancers.splice(this.ind, 1);
  }
  
  this.changeShape = function(){
    // if (!this.clickType){
    //   this.r += this.dir.y*0.3;
    // }
    this.n += this.g;

    if (this.n < 1 || this.n > 10){
      this.g = -this.g;
    }
    
  };

  this.changeDir = function(){
    if (this.pos.x >= width){
        this.dir = new p5.Vector(-this.dir.x, this.dir.y);
    } else if (this.pos.x <= 0){
        this.dir = new p5.Vector(abs(this.dir.x), this.dir.y);
    } else if (this.pos.y >= height){
        this.dir = new p5.Vector(this.dir.x, -this.dir.y);
    } else if (this.pos.y <= 0){
        this.dir = new p5.Vector(this.dir.x, abs(this.dir.y));
    } else {
      // for (j=0;j<this.otherDancers.length;j++){
      //     if (this.pos.dist(this.otherDancers[j].pos) < this.r + this.otherDancers[j].r){
            
      //       this.dir.rotate(0.001); 
      //     }
      // }
    }

    if (this.clickType){
      var mouseVec = new p5.Vector(mouseX, mouseY);
      if (this.pos != mouseVec){
        var followAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
        this.dir = new p5.Vector(cos(followAngle), sin(followAngle));
      }

      this.mult = (this.pos.dist(mouseVec))*0.01;
    } else {

    }
  };
};

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function softPolygon(x, y, radius, npoints) {
  var vertices = [];
  var angle = TWO_PI / npoints;
  beginShape();
  for (a = 0; a < TWO_PI; a += angle) { 
    if (a > 0){
      var sx1 = x + cos(a) * radius;
      var sy1 = y + sin(a) * radius;
      var sx2 = x+cos(a-1) * radius;
      var sy2 = x+sin(a-1) * radius;
      vertex(sx1, sy1);
      bezierVertex(sx1*1.2, sy1*1.2, sx1*2, sy1*2, sx2, sy2);
    }
  }
  endShape(CLOSE);
}

function mousePressed(){
  ClickDancers.push(new Dancer(mouseX,
                          mouseY,
                          random(0, 0.5), 
                          random(3, 10), 
                          new p5.Vector(random(-1, 1), random(-1, 1)),
                          color(86, 122, 131),
                          true,
                          i));
}

function touchStarted(){
  ClickDancers.push(new Dancer(touches[0].x,
                          touches[0].y,
                          random(width/3, height/3), 
                          random(3, 10), 
                          new p5.Vector(random(-1, 1), random(-1, 1)),
                          color(86, 122, 131),
                          true,
                          i));
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
