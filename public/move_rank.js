goog.provide('gobbs.MoveRank');

gobbs.MoveRank = function(move) {
  for (var i=0; i<gobbs.MoveRank.KEYS.length; i++) {
    this[gobbs.MoveRank.KEYS[i]] = 0;
  }
  this.move = move;
  this.board = move.piece.player.game.board.toObj();
  this.outcome = move.piece.player.game.board.toObj();
  if (move.piece.stack.owner) {
    this.piece = move.piece.toObj();
  } else {
    this.piece = this.outcome[move.piece.stack.row][move.piece.stack.col].pop();
  }
  this.outcome[move.stack.row][move.stack.col].push(this.piece);

  this.analyze();
};

gobbs.MoveRank.KEYS = [
  'victory',  // move causes win or loss
  'prevent',  // move prevents opponent win on next turn
  'setup',    // move sets up win on next turn
  'capture',  // capturing opponent's pieces
  'three',    // number of three in a line that i have - number of opponent's
  'two',      // number of two in a line that i have - number of opponent's
  'position', // does this move place a piece in a corner or middle piece?
  'size',     // size of the piece being moved (smaller is better)
  'random'    // random tie breaker
];

gobbs.MoveRank.compare = function(a, b) {
  for (var i=0; i<gobbs.MoveRank.KEYS.length; i++) {
    var key = gobbs.MoveRank.KEYS[i];
    if (b.rank[key] != a.rank[key]) {
      return b.rank[key] - a.rank[key];
    }
  }
  return 0;
};

gobbs.MoveRank.prototype.getPosition = function() {
  var good = [[0,0],[0,3],[1,1],[1,2],[2,1],[2,2],[3,0],[3,3]];
  for (var i=0; i<8; i++) {
    if (this.move.stack.row == good[i][0] && this.move.stack.col == good[i][1]) {
      return 1;
    }
  }
  return 0;
};

// counts the number of each player's pieces in the specifed line after the move is made
gobbs.MoveRank.prototype.pieceCounts = function(line) {
  var counts = {mine: 0, opponent: 0};
  for (var i=0; i<4; i++) {
    var stack = line[i];
    var piece = stack[stack.length - 1];
    if (piece) {
      if (piece.player == this.move.piece.player.number) {
        counts.mine++;
      } else {
        counts.opponent++;
      }
    }
  }
  return counts;
};

gobbs.MoveRank.buildLines = function(grid) {
  var lines = new Array();
  var diag1 = new Array();
  var diag2 = new Array();
  for (var i=0; i<4; i++) {
    var horizontal = new Array();
    var vertical = new Array();
    diag1.push(grid[i][i]);
    diag2.push(grid[(i - 3) * -1][i]);
    for (var j=0; j<4; j++) {
      horizontal.push(grid[i][j]);
      vertical.push(grid[j][i]);
    }
    lines.push(horizontal);
    lines.push(vertical);
  }
  lines.push(diag1);
  lines.push(diag2);
  return lines;
};

gobbs.MoveRank.countKey = function(count) {
  switch(count) {
  case 4:
    return 'victory';
  case 3:
    return 'three';
  case 2:
    return 'two';
  default:
    return null;
  }
};

gobbs.MoveRank.prototype.getCapture = function() {
  var tp = this.move.stack.topPiece();
  if (tp && tp.player != this.move.piece.player) { // this move captures an opponent
    if (this.move.piece.stack.owner) { // this piece is not on the board
      return 3;
    }
    var diff = this.move.piece.size - tp.size;
    var under = this.move.piece.stack.pieces[this.move.piece.stack.pieces.length - 2];
    if (under && under.player != this.move.piece.player) { // this move reveals an opponent's piece
      var revealed = this.move.piece.size - under.size;
      return revealed - diff;
    }
    return 3 - diff;
  }
  return 0;
};

gobbs.MoveRank.prototype.couldLose = function(line) {
  var opponents = 0;
  var my_size = null;
  for(var i=0; i<4; i++) {
    var stack = line[i];
    var piece = stack[stack.length - 1];
    if (piece) {
      if (piece.player == this.move.piece.player.number) {
        my_size = piece.size;
      } else {
        opponents++;
      }
    }
  }
  if (opponents == 3) {
    if (my_size == null) { // not blocked
      return 4;
    }
    return 3 - my_size; // it's hard to get exact on if the opponent can actually win but we can guess
  }
  return 0;
};

gobbs.MoveRank.prototype.analyze = function() {
  var lines = gobbs.MoveRank.buildLines(this.outcome);
  for (var l=0; l<10; l++) {
    var line = lines[l];
    var counts = this.pieceCounts(line);
    var types = ['opponent', 'mine'];
    for (var i=0; i<2; i++) {
      var key = gobbs.MoveRank.countKey(counts[types[i]]);
      switch (types[i]) {
      case 'opponent':
        if (key == 'victory') {
          return this.victory = -1;
        } else if(key) {
          this[key]--;
        }
        break;
      case 'mine':
        if (key == 'victory') {
          return this.victory = 1;
        } else if(key) {
          this[key]++;
        }
        break;
      }
      if (counts.opponent == 3) {
        this.prevent -= this.couldLose(line);
      }
    }
  }

  this.capture = this.getCapture();
  this.position = this.getPosition();
  this.size = 4 - this.move.piece.size;
  this.random = Math.floor(Math.random() * 101); // initialize random tie-breaker
};