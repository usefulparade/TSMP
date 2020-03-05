var Dancers = [];
var canvParent;
var canv;

function setup() {
  canv = createCanvas(windowWidth, windowHeight);
  canvParent = document.getElementById("canvParent");
  canv.parent(canvParent);
  for (i=0;i<10;i++){
  Dancers[i] = new Dancer(random(width*0.33, width*0.66), 
                          random(height*0.33, height*0.66), 
                          random(width/2, height/2), 
                          random(3, 10), 
                          new p5.Vector(random(-1, 1), random(-1, 1)),
                          i);
  }

  for (j=0;j<Dancers.length;j++){
    Dancers[j].learnOthers();
  }
}

function draw() {
  // background(255);
  clear();
  
  for (i=0;i<Dancers.length;i++){
    Dancers[i].show();
    Dancers[i].go();
    Dancers[i].changeDir();
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

var Dancer = function(_x, _y, _r, _n, _dir, _ind){
  this.pos = new p5.Vector(_x, _y);
  this.dir = _dir.normalize();
  this.r = _r;
  this.n = _n;
  this.ind = _ind;
  this.otherDancers = [];
  this.g = random(-0.0005, -0.005);
  if (this.ind%2){
    this.rotate = random(1500, 2000);
  } else {
    this.rotate = random(-1500, -2000);
  }
  this.col = color(random(90, 110), random(10, 30), random(200, 220));
  this.go = function(){
      this.pos.add(this.dir);
  };
  
  this.show = function(){
    this.changeShape();
      push();
        translate(this.pos.x, this.pos.y);
        fill(this.col);
        noStroke();
        // rotate(frameCount / this.rotate)*int(random(-2, 2));
        polygon(0, 0, this.r, this.n);
        
      pop();

      // push();
      //   fill(this.col * 2);
      //   noStroke();
      //   beginShape();
      //     vertex(0,height);
      //     bezierVertex(this.pos.x, this.pos.y, mouseX, mouseY, width, height);
      //   endShape(CLOSE);
      // pop();

      // push();
      //   translate(0, this.ind*100);
      //   noFill();
      //   stroke(this.ind);
      //   strokeWeight(3);
      //   beginShape();
      //     vertex(0,0);
      //     bezierVertex(this.pos.x, this.pos.y, mouseX, mouseY, width, 0);
      //   endShape();
      // pop();

  };

  this.learnOthers = function(){
    this.otherDancers = Dancers.map(x=>x);
    this.otherDancers.splice(this.ind, 1);
    console.log(this.otherDancers);
  }
  
  this.changeShape = function(){
    this.r += this.dir.y*0.3;
    this.n += this.g;
    // if (this.n >= 1){
    //   this.n = this.n + this.dir.x*0.01;
    // } else if (this.n > 0.5 && this.n < 1){
    //   this.n = this.n + this.dir.x* 0.01;
    // } else if (this.n <= 0.5 && this.n > 0){
    //   this.n += 0.5;
    // } else if (this.n <= 0){
    //   this.n += 1;
    // }

    if (this.n < 0.02 || this.n > 10){
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
      for (j=0;j<this.otherDancers.length;j++){
          // push();
          //   line(this.pos.x, this.pos.y, this.otherDancers[j].pos.x, this.otherDancers[j].pos.y);
          // pop();
          if (this.pos.dist(this.otherDancers[j].pos) < this.r + this.otherDancers[j].r){
            
            this.dir.rotate(0.001); 
            // console.log("collision!");
          }
      }
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
