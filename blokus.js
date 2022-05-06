// PAPERSCRIPT!

var edgeSize = 15;

var tiles = (function () { // Array of Groups
  // All Blokus tiles, each tile on new line
  var tileStrings = [
    "00",
    "00,01",
    "00,01,02",
    "00,01,11",
    "00,01,02,03",
    "00,01,02,12",
    "00,01,02,11",
    "00,01,10,11",
    "00,01,11,12",
    "00,01,02,03,04",
    "00,01,02,03,13",
    "00,01,02,12,13",
    "00,01,02,11,12",
    "00,01,02,10,12",
    "00,01,02,03,11",
    "10,11,12,02,22",
    "00,01,02,12,22",
    "00,10,11,21,22",
    "00,01,11,21,22",
    "00,01,11,21,12",
    "10,01,11,21,12",
  ];
  var getTile = function (tileString) {
    var coorStrings = tileString.split(',');
    return new Group(coorStrings.map(function (coorString) {
        return new Path.Rectangle(new Point(+coorString[0] * edgeSize, +coorString[1] * edgeSize), new Size(edgeSize, edgeSize));
    }));
  };
  return tileStrings.map(getTile);
})();

console.log(tiles)

tile = tiles[18]

tile.fillColor = 'red';
tile.position = new Point([100, 100]);
tile.onMouseDrag = function(event) {
  tile.position += event.delta;
}

var mousePos;
function onMouseMove(event) {
  mousePos = event.point;
}

function onKeyDown(event) {
  if (tile.contains(mousePos)) {
    if (event.key == 'a') {
      tile.rotate(-90, mousePos);
    }
    else if (event.key == 'd') {
      tile.rotate(90, mousePos);
    }
    else if (event.key == 's') {
      tile.scale(-1, 1, mousePos);
    }
  }
}