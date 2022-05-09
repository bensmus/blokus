// PAPERSCRIPT!

var edgeSize = 25;

// keep everything inside these bounds
var xMax = 1350;
var yMax = 750;

var mousePos;
view.on('mousemove', function(event) {
  mousePos = event.point;
});

var selectedTile = null;
var keydown = false;
var player1 = true;

function getBoard() {
  var boardPaths = []
  var gamestate = [] // 2d array of 0's, initial empty
  for (var rowi = 0; rowi < 14; rowi++) {
    var row = []
    for (var coli = 0; coli < 14; coli++) {
      var topleft = new Point([coli * edgeSize, rowi * edgeSize])
      boardPaths.push(new Path.Rectangle(topleft, new Size([edgeSize, edgeSize])))
      row.push(0)
    }
    gamestate.push(row);
  }
  var board = new Group(boardPaths)
  return [board, gamestate];
}

function getTileCode(tiles1, tiles2, tile) {
  var tileCode;
  if (tiles1.indexOf(tile) >= 0) {
    tileCode = 'r' + (tiles1.indexOf(tile) + 1) // r for red
  } else {
    tileCode =  'b' + (tiles2.indexOf(tile) + 1) // b for blue
  }
  return tileCode;
}

function drawBoard(board) {
  board.strokeColor = 'gainsboro'
  board.position = new Point([xMax / 2, yMax / 2])
}

function getInfoText() {
  var infoText = new PointText(new Point(xMax / 2, 600));
  infoText.justification = 'center';
  return infoText;
}

function drawInfoText(infoText, player1) {
  if (player1) {
    infoText.fillColor = 'red';
    infoText.content = 'Red player\'s turn';
  } else {
    infoText.fillColor = '#2076e6';
    infoText.content = 'Blue player\'s turn';
  }
}

function getSpawnPoint(tileCode) {
  var tileIndex = tileCode.slice(1) - 1;
  var gridx = 4;
  var colNumber = tileIndex % gridx;
  var rowNumber = Math.floor(tileIndex / gridx);
  var xCenter = colNumber * 3.5 * edgeSize + 2 * edgeSize;
  var yCenter = rowNumber * 5 * edgeSize + 2.5 * edgeSize;
  var offset = 0;
  if (tileCode[0] == 'b') {
    offset = 990;
  }
  return new Point([xCenter + offset, yCenter]);
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

function drawTiles(tiles1, tiles2) {
  var allTiles = tiles1.concat(tiles2);
  for (var tileIndex = 0; tileIndex < 42; tileIndex++) {
    var tile = allTiles[tileIndex];
    var tileCode = getTileCode(tiles1, tiles2, tile);
    tile.fillColor = 'red';
    if (tileCode[0] == 'b') {
      tile.fillColor = '#2076e6'
    }
    tile.strokeColor = 'black';
    tile.position = getSpawnPoint(tileCode)
  }
}

function updateGamestate(tiles1, tiles2, tile, gamestate) {
  function extractTopLeftPoints(tile) {
    var topLeftPoints = []
    for (var i = 0; i < tile.children.length; i++) {
      var topleftPoint = tile.children[i].segments[1].point;
      topLeftPoints.push(topleftPoint);
    }
    return topLeftPoints;
  }

  var topLeftPoints = extractTopLeftPoints(tile);

  function getIndexPoints(topLeftPoints) {
    var boardTopLeft = new Point((xMax / 2) - (14 * edgeSize / 2), (yMax / 2) - (14 * edgeSize / 2));
    var indexPoints = [];
    for (var i = 0; i < topLeftPoints.length; i++) {
      var topLeftPoint = topLeftPoints[i];
      var indexPoint = (topLeftPoint - boardTopLeft) / edgeSize;
      indexPoints.push(indexPoint);
    }
    return indexPoints;
  }

  function validateIndexPoints(indexPoints) {
    for (var i = 0; i < indexPoints.length; i++) {
      var indexPoint = indexPoints[i];
      if (indexPoint.x < 0 || indexPoint.x > 13 || indexPoint.y < 0 || indexPoint.y > 13) {
        return false;
      } 
    }
    return true;
  }

  var indexPoints = getIndexPoints(topLeftPoints);
  var tileCode = getTileCode(tiles1, tiles2, tile);
  if (!validateIndexPoints(indexPoints)) {
    return false;
  }
  for (var i = 0; i < indexPoints.length; i++) {
    var indexPoint = indexPoints[i];
    gamestate[indexPoint.y][indexPoint.x] = tileCode
  }
  return true;
}

function addListeners(tiles1, tiles2, gamestate, infoText) {
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
      };
    }
  }

  function getSnap(val, edgeSize) {
    return edgeSize * Math.round(val / edgeSize)
  }

  view.on('keyup', function() {
    keydown = false;
  })

  view.on('keydown', function (event) {
    if (!keydown) {
      if (selectedTile) {
        if (event.key == 'a') {
          rotateAnim(selectedTile, false)
        }
        else if (event.key == 'd') {
          rotateAnim(selectedTile, true)
        }
        else if (event.key == 's') {
          if (!view.onFrame) {
            selectedTile.scale(-1, 1);
          }
        }
        else if (event.key == 'w') {
          if (!view.onFrame) {
            selectedTile.scale(1, -1);
          }
        }
        else if (event.key == 'f') {
          var tileCode = getTileCode(tiles1, tiles2, selectedTile);
          selectedTile.position = getSpawnPoint(tileCode);
          selectedTile = null;
        }
      }
      keydown = true;
    }
  });

  view.on('mousemove', function (event) {
    if (selectedTile) {
      selectedTile.position += event.delta;
    }
  });

  view.on('mousedown', function () {
    if (selectedTile) {
      var tilePoint = selectedTile.children[0].segments[0].point;
      var x = tilePoint.x;
      var y = tilePoint.y;
      var snapPoint = new Point([getSnap(x, edgeSize), getSnap(y, edgeSize)]);
      selectedTile.translate(snapPoint - tilePoint);
      var valid = updateGamestate(tiles1, tiles2, selectedTile, gamestate);
      selectedTile = null;
      if (valid) {
        player1 = !player1;
        drawInfoText(infoText, player1);
      }
    } else {
      var targetTile = tiles1.concat(tiles2).find(function (tile) { return tile.contains(mousePos) });
      if (targetTile) {
        selectedTile = targetTile;
      }
    }
  });
}

var board = getBoard()[0];
var gamestate = getBoard()[1];
drawBoard(board);

var infoText = getInfoText();
drawInfoText(infoText, player1); 

(function () {
  var controls = new PointText(new Point(xMax / 2, 700));
  controls.justification = 'center';
  controls.content = 'Left click to select tile, move mouse to move tile, left click again to place tile.\nFor selected tile: A and D to rotate, S to mirror across y, W to mirror across x, F to return.'
  controls.fillColor = 'black'
})();

var tiles1 = getTiles();
var tiles2 = getTiles();
drawTiles(tiles1, tiles2);

addListeners(tiles1, tiles2, gamestate, infoText);
