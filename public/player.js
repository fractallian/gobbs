goog.provide('gobbs.Player');

goog.require('gobbs.Stack');
goog.require('gobbs.Piece');
goog.require('gobbs.MoveRank');

gobbs.Player = function(game, number) {
  this.game = game;
  this.number = number;
  this.stacks = new Array();
  this.CPU = false;
  for(var i=0; i<3; i++) {
    var s = new gobbs.Stack(this);
    for(var j=0; j<4; j++) {
      var n = (4 * i) + j;
      var p = new gobbs.Piece(this, j, n);
      s.addPiece(p);
    }
    this.stacks.push(s);
  }
};

gobbs.Player.prototype.toObj = function() {
  return {
    number: this.number,
    CPU: this.CPU,
    stacks: gobbs.objArray(this.stacks)
  };
};

gobbs.Player.prototype.playMove = function(move) {
  console.log(move.rank);

  if (!this.isMyTurn() || move.piece.player != this) {
    return false;
  }
  var anim = new lime.animation.MoveTo(this.game.stackCoords(move.stack)).setDuration(1);
  move.piece.lift();

  goog.events.listen(anim, lime.animation.Event.STOP, function() {
    move.piece.place(move.stack);
  });
  move.piece.runAction(anim);
};

gobbs.Player.prototype.rankedMoves = function() {
  var moves = gobbs.Move.possibleMoves(this);
  for (var i=0; i<moves.length; i++) {
    moves[i].getRank();
  }
  // moves = moves.sort(function(a, b) {
  //   for (var i=0; i<10; i++) {
  //     if (b.rank[i] != a.rank[i]) {
  //       return b.rank[i] - a.rank[i];
  //     }
  //   }
  //   return 0;
  // });
  moves.sort(gobbs.MoveRank.compare);
  var n = [];
  for (var i=0; i<moves.length; i++) {
    n.push(moves[i].rank);
  }
  return moves;
}

gobbs.Player.prototype.playablePieces = function() {
  var pieces = new Array();
  for (var i=0; i<3; i++) {
    var p = this.stacks[i].topPiece();
    if (p) {
      pieces.push(p);
    }
  }
  for (var r=0; r<4; r++) {
    for (var c=0; c<4; c++) {
      var p = this.game.board.grid[r][c].topPiece();
      if (p && p.player == this) {
        pieces.push(p);
      }
    }
  }
  return pieces;
};

gobbs.Player.prototype.isMyTurn = function() {
  return (this.game.turn == this) ? true : false;
};