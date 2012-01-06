goog.provide('gobbs.Board');

goog.require('lime.RoundedRect');

goog.require('gobbs.Stack');
goog.require('gobbs.Line');

gobbs.Board = function() {
  lime.RoundedRect.call(this);

  var size = (gobbs.Stack.size * 4) + (gobbs.Board.lineWidth * 5);
  var space_size = gobbs.Stack.size + gobbs.Board.lineWidth;
  this.setSize(size, size).setRadius(10).setFill(0, 0, 0).setAnchorPoint(0, 0);
  this.grid = new Array();

  for(var i=0; i<4; i++) {
    var row = new Array();
    for(var j=0; j<4; j++) {
      var x = (j * space_size) + gobbs.Board.lineWidth + (gobbs.Stack.size / 2);
      var y = (i * space_size) + gobbs.Board.lineWidth + (gobbs.Stack.size / 2);
      var s = new gobbs.Stack().setPosition(x, y).setFill(200, 200, 200);
      s.row = i;
      s.col = j;
      row.push(s);
      this.appendChild(s);
    }
    this.grid.push(row);
  }
  this.lines = gobbs.Line.buildLines(this.grid);
};
goog.inherits(gobbs.Board, lime.RoundedRect);

gobbs.Board.prototype.toObj = function() {
  return gobbs.objArray(this.grid);
};

gobbs.Board.lineWidth = 6;

gobbs.Board.prototype.movesExist = function(piece) {
  for (var r=0; r<4; r++) {
    for (var c=0; c<4; c++) {
      if (this.grid[r][c].canAddPiece(piece)) {
        return true;
      }
    }
  }
  return false;
};

gobbs.Board.prototype.checkWin = function() {
  for (var i=0; i<this.lines.length; i++) {
    var winner = this.lines[i].containsFour();
    if (winner) {
      winner.game.endGame(winner, this.lines[i]);
      return true;
    }
  }
  return false;
};

gobbs.Board.prototype.stackAtCoords = function(coords) {
  for (var r=0; r<4; r++) {
    for (var c=0; c<4; c++) {
      var stack = this.grid[r][c];
      var box = stack.getBoundingBox();
      if (box.contains(coords)) {
        return stack;
      }
    }
  }
};

gobbs.Board.prototype.linesForStack = function(stack) {
  var lines = new Array();
  for (var i=0; i<10; i++) {
    if (this.lines[i].containsStack(stack)) {
      lines.push(this.lines[i]);
    }
  }
  return lines;
};