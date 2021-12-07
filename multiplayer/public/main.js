var input;
var button;
var name;
var selectSkin;
function setup() {
  createCanvas(480, 120);
  resetSetup();
  var button = createButton("reset");
  button.mousePressed(resetSetup);
}