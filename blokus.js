// PAPERSCRIPT!

var edgeSize = 25;

// keep everything inside these bounds
var xMax = 1350;
var yMax = 750;

var mousePos;
view.onMouseMove = function(event) {
  mousePos = event.point;
}

function drawBoard() {
  var boardPaths = []
  for (var rowi = 0; rowi < 14; rowi++) {
    for (var coli = 0; coli < 14; coli++) {
      var topleft = new Point([coli * edgeSize, rowi * edgeSize])
      boardPaths.push(new Path.Rectangle(topleft, new Size([edgeSize, edgeSize])))
    }
  }

  var board = new Group(boardPaths)
  board.strokeColor = 'gainsboro'
  board.position = new Point([xMax / 2, yMax / 2])
}

function getTiles() {
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

  var tiles = tileStrings.map(getTile);
  return tiles;
}

function drawTiles(tiles, player) {
  function getSpawnPoint(tileIndex) {
    var gridx = 4;
    var colNumber = tileIndex % gridx;
    var rowNumber = Math.floor(tileIndex / gridx);
    var xCenter = colNumber * 3.5 * edgeSize + 2 * edgeSize;
    var yCenter = rowNumber * 5 * edgeSize + 2.5 * edgeSize;
    var offset = 0;
    if (player == 2) {
      offset = 990;
    }
    return new Point([xCenter + offset, yCenter]);
  }
  
  for (var tileIndex = 0; tileIndex < 21; tileIndex++) {
    var tile = tiles[tileIndex];
    tile.fillColor = 'red';
    if (player == 2) {
      tile.fillColor = '#2076e6'
    }
    tile.strokeColor = 'black';
    tile.position = getSpawnPoint(tileIndex)
  }
}

function addListeners(tiles) {
  function rotateAnim(tile, pos) {
    var counter = 0;
    if (!view.onFrame) {
      view.onFrame = function () {
        if (pos) {
          tile.rotate(5);
        } else {
          tile.rotate(-5);
        }
        counter++;
        if (counter == 90 / 5) {
          view.onFrame = undefined;
        }
      }
    }
  }

  function getSnap(val, edgeSize) {
    return edgeSize * Math.round(val / edgeSize)
  }

  view.onKeyDown = function (event) {
    var targetTile = tiles.find(function (tile) { return tile.contains(mousePos) });
    
    if (event.key == 'space') {
      if (targetTile) {
        var tilePoint = targetTile.children[0].segments[0].point
        var x = tilePoint.x;
        var y = tilePoint.y;
        var snapPoint = new Point([getSnap(x, edgeSize), getSnap(y, edgeSize)]);
        targetTile.translate(snapPoint - tilePoint);
        console.log(tilePoint, snapPoint);
      }
      return false; // prevent default
    }

    if (targetTile) {
      if (event.key == 'a') {
        rotateAnim(targetTile, false)
      }
      else if (event.key == 'd') {
        rotateAnim(targetTile, true)
      }
      else if (event.key == 's') {
        targetTile.scale(-1, 1);
      }
      else if (event.key == 'f') {
        var tileIndex = tiles.indexOf(targetTile);
        targetTile.position = getSpawnPoint(tileIndex);
      }
    }
  }

  for (var tileIndex = 0; tileIndex < 42; tileIndex++) { // do for all tiles
    var tile = tiles[tileIndex];
    tile.onMouseDrag = function (event) {
      this.position += event.delta;
    }
  }
}

drawBoard();
var tiles1 = getTiles();
var tiles2 = getTiles();
drawTiles(tiles1, 1);
drawTiles(tiles2, 2);
addListeners(tiles1.concat(tiles2));
