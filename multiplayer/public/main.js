var input;
var button;
var playerName;
var selectSkin;
function setup() {
  createCanvas(480, 120);
  resetSetup();
  var button = createButton("reset");
  button.mousePressed(resetSetup);
}

function resetSetup() {
  input = createInput();
  input.position(20, 150);
  button = createButton("submit");
  button.position(160, 150);
  button.mousePressed(drawName);

  selectSkin = createSelect();
  selectSkin.option('paul');
  selectSkin.option('nikita');
  selectSkin.option('sasha');
  
  background(100);
  noStroke();
  text("Enter your name.", 20, 20);
}

function drawName() {
  background(100);
  textSize(30);
  playerName = input.value();
  for (var i=0; i < 30; i++) {
    fill(random(255));
    text(name, random(width), random(height));
  }
  localStorage["playerName"] = playerName;
  localStorage["skin"] = selectSkin.value();
  window.location = "game/index.html";
}