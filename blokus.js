// PAPERSCRIPT!

var edgeSize = 10;

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

function rotateTile(tile, positive) {
  var matrix;
  if (positive) {
    matrix = new Matrix(0, -1, 1, 0);
  } else {
    matrix = new Matrix(0, 1, -1, 0)
  }
  tile.transform(matrix)
}

tiles[11].fillColor = 'red';
tiles[11].position = new Point([100, 100]);
tiles[11].onMouseDrag = function(event) {
  tiles[11].position += event.delta;
}