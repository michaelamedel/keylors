// draft draft draft demoooooo
// need to figure out how to get all 5 keys to appear

let palettes = [
  { key: 'Eb major', name: 'euphoric purple', cols: ["#D79AED", "#8437AB", "#481166"] },
  { key: "C# minor", name: "violet haze", cols: ["#3D2B8C", "#8E5CFF", "#F7C5FF"] },
  { key: "E major",  name: "amber dusk",  cols: ["#FFB703", "#FB8500", "#6A040F"] },
  { key: "F major",  name: "electric sky", cols: ["#00BBF9", "#00F5D4", "#FEE440"] },
  { key: "G major",  name: "daylight green", cols: ["#80ED99", "#38B000", "#22577A"] }
];

let setlist = [];
let currentIndex = 0;

let particles = [];
let mix = 1;           // 0-1 crossfade amount
let mixing = false;
let fromPalette, toPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // random setlist for each load
  setlist = shuffle([...palettes]).slice(0, int(random(3, 6)));
  fromPalette = setlist[0];
  toPalette = setlist[0];

  // to create the particles
  for (let i = 0; i < 180; i++) particles.push(new Orb());
}

function draw() {
  background(5, 8, 12, 30); // trailing softness

  // to update the crossfade
  if (mixing) {
    mix += 0.02;
    if (mix >= 1) {
      mix = 1;
      mixing = false;
      fromPalette = toPalette;
    }
  }

  // to draw the particles with the blended palette
  for (let p of particles) {
    p.update();
    p.show(blendedColor());
  }

  // minimal text layer
  fill(255, 220);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Now mixing: ${fromPalette.key} → ${toPalette.key}`, 18, 18);
  text(`${toPalette.name}`, 18, 38);
  textSize(12);
  fill(255, 150);
  text("click to crossfade", 18, 60);
}

function mousePressed() {
  // trigger the next palette
  currentIndex = (currentIndex + 1) % setlist.length;
  toPalette = setlist[currentIndex];
  mix = 0;
  mixing = true;
}

// returns a color sampled from a blend of two palettes
function blendedColor() {
  let a = random(fromPalette.cols);
  let b = random(toPalette.cols);
  let ca = color(a);
  let cb = color(b);
  return lerpColor(ca, cb, mix);
}

class Orb { // for the orbs
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.base = createVector(this.pos.x, this.pos.y);
    this.r = random(8, 40);
    this.t = random(1000);
  }
  update() {
    // a Perlin drift ("uncertain" aspect, smooth)
    let n1 = noise(this.t, 0);
    let n2 = noise(0, this.t);
    this.pos.x += map(n1, 0, 1, -1.2, 1.2);
    this.pos.y += map(n2, 0, 1, -1.2, 1.2);
    this.t += 0.01;

    // da wrap around
    if (this.pos.x < -50) this.pos.x = width + 50;
    if (this.pos.x > width + 50) this.pos.x = -50;
    if (this.pos.y < -50) this.pos.y = height + 50;
    if (this.pos.y > height + 50) this.pos.y = -50;
  }
  show(c) {
    let cc = color(c);
    cc.setAlpha(40);
    fill(cc);
    circle(this.pos.x, this.pos.y, this.r * 2.2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}