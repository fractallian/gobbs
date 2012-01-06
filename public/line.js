goog.provide('gobbs.Line');


gobbs.Line = function(stacks, id) {
  this.stacks = stacks;
  this.id = id;
};

gobbs.Line.prototype.containsStack = function(stack) {
  for (var i=0; i<4; i++) {
    if (this.stacks[i] == stack) {
      return true;
    }
  }
  return false;
};

gobbs.Line.prototype.containsPiece = function(piece) {
  for (var i=0; i<4; i++) {
    if (this.stacks[i].containsPiece(piece)) {
      return true;
    }
  }
  return false;
};

gobbs.Line.prototype.containsThree = function(player) {
  return this.containsNumber(player, 3);
};

gobbs.Line.prototype.containsTwo = function(player) {
  return this.containsNumber(player, 2);
};

gobbs.Line.prototype.containsOne = function(player) {
  return this.containsNumber(player, 1);
};

gobbs.Line.prototype.containsNumber = function(player, number) {
  var yes = 0;
  var no = 0;
  for (var i=0; i<4; i++) {
    var tp = this.stacks[i].topPiece();
    if (tp && tp.player == player) {
      yes++;
    } else {
      no++;
    }
    if (no > 4 - number) {
      return false;
    }
    if (yes >= number) {
      return true;
    }
  }
};

gobbs.Line.prototype.pieceCounts = function() {
  var counts = {mine: 0, opponent: 0};
  for (var i=0; i<4; i++) {
    var tp = this.stacks[i].topPiece();
    if (tp) {
      if (tp.player == this.player) {
        counts.mine++;
      } else {
        counts.opponent++;
      }
    }
  }
  return counts;
};

// returns true if player can make a winning move on this line
gobbs.Line.prototype.canPlayToWin = function(player) {
  if (!this.containsThree(player)) {
    console.log("line: " + this.id + " not containing 3");
    return false;
  }
  var pieces = player.playablePieces();
  for (var i=0; i<pieces.length; i++) {
    for (var j=0; j<4; j++) {
      var stack = this.stacks[j];
      var tp = stack.topPiece();
      if ((!tp || tp.player != player) && stack.canAddPiece(pieces[i])) {
        return true;
      }
    }
  }
  console.log("can't play to win by default");
  return false;
};

gobbs.Line.prototype.containsFour = function() {
  var p1 = 0;
  var p2 = 0;
  for (var i=0; i<4; i++) {
    var tp = this.stacks[i].topPiece();
    if (!tp) { // there is a blank
      return false;
    }
    if (tp.player.number == 1) {
      p1++;
    } else {
      p2++;
    }
    if (p1 > 0 && p2 > 0) {
      return false;
    }
    if (p1 == 4 || p2 == 4) {
      return tp.player;
    }
  }
};

gobbs.Line.prototype.highlight = function() {
  for (var i=0; i<4; i++) {
    this.stacks[i].setFill("#FF0000");
  }
};

gobbs.Line.buildLines = function(grid) {
  var lines = new Array();
  var diag1 = new Array();
  var diag2 = new Array();
  var id = 0;
  for (var i=0; i<4; i++) {
    var horizontal = new Array();
    var vertical = new Array();
    diag1.push(grid[i][i]);
    diag2.push(grid[(i - 3) * -1][i]);
    for (var j=0; j<4; j++) {
      horizontal.push(grid[i][j]);
      vertical.push(grid[j][i]);
    }
    lines.push(new gobbs.Line(horizontal, id));
    lines.push(new gobbs.Line(vertical, id + 4));
    id++;
  }
  lines.push(new gobbs.Line(diag1, 8));
  lines.push(new gobbs.Line(diag2, 9));
  return lines;
};