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

var mousePos;
function onMouseMove(event) {
  mousePos = event.point;
}

function onKeyDown(event) {
  var targetTile = tiles.find(function (tile) { return tile.contains(mousePos) });
  if (targetTile) {
    if (event.key == 'a') {
      targetTile.rotate(-90, mousePos);
    }
    else if (event.key == 'd') {
      targetTile.rotate(90, mousePos);
    }
    else if (event.key == 's') {
      targetTile.scale(-1, 1, mousePos);
    }
  }
}

for (var i = 0; i < 21; i++) {
  var tile = tiles[i];
  var gridx = 7;
  tile.fillColor = 'red';
  tile.strokeColor = 'black';
  var colNumber = i % gridx;
  var rowNumber = Math.floor(i / gridx);
  var xCenter = colNumber * 5 * edgeSize + 2.5 * edgeSize;
  var yCenter = rowNumber * 5 * edgeSize + 2.5 * edgeSize;
  tile.position = new Point([xCenter, yCenter]);
  tile.onMouseDrag = function (event) {
    this.position += event.delta;
  }
}

// var tile = tiles[1];
// tile.fillColor = 'red'