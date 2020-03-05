var Dancers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (i=0;i<10;i++){
  Dancers[i] = new Dancer(width/2, height/2, random(width/4, height/4), new p5.Vector(random(-1, 1), random(-1, 1)), 1*i);
  }
}

function draw() {
  background(255);
  
  for (i=0;i<Dancers.length;i++){
    Dancers[i].show();
    Dancers[i].go();
    Dancers[i].changeDir();
  }
  
}

var Dancer = function(_x, _y, _r, _dir, _c){
  this.pos = new p5.Vector(_x, _y);
  this.dir = _dir;
  this.r = _r;
  this.c = _c
  
  this.go = function(){
      this.pos.add(this.dir);
  }
  
  this.show = function(){
      fill(90*this.c, 10*this.c, 110*this.c);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.r*2);
  }
  
  this.changeDir = function(){
    if (this.pos.x + this.r >= width){
        this.dir = new p5.Vector(-this.dir.x, this.dir.y);
    } else if (this.pos.x - this.r <= 0){
        this.dir = new p5.Vector(abs(this.dir.x), this.dir.y);
    } else if (this.pos.y + this.r >= height){
        this.dir = new p5.Vector(this.dir.x, -this.dir.y);
    } else if (this.pos.y - this.r <= 0){
        this.dir = new p5.Vector(this.dir.x, abs(this.dir.y));
    }
  }
}