goog.provide('gobbs.Stack');

goog.require('lime.RoundedRect');

gobbs.Stack = function(owner) {
  lime.RoundedRect.call(this);
  this.owner = owner;
  this.pieces = new Array();
  this.setRadius(10).setSize(gobbs.Stack.size, gobbs.Stack.size);
  this.setFill(0,0,0,0);
};
goog.inherits(gobbs.Stack, lime.RoundedRect);

gobbs.Stack.prototype.toObj = function() {
  return gobbs.objArray(this.pieces);
};

gobbs.Stack.size = (1024 - (6 * 5)) / 6;

gobbs.Stack.prototype.addPiece = function(piece) {
  if (!this.empty()) {
    this.topPiece().setDraggable(false);
  }
  this.pieces.push(piece);
  piece.stack = this;
  piece.setDraggable(true);
};

gobbs.Stack.prototype.getLines = function() {
  return (this.lines) ? this.lines : this.lines = gobbs.Game.current.board.linesForStack(this);
};

gobbs.Stack.prototype.containsPiece = function(piece) {
  for (var i=0; i<this.pieces.length; i++) {
    if (piece == this.pieces[i]) {
      return true;
    }
  }
  return false;
};

gobbs.Stack.prototype.canAddPiece = function(piece) {
  if (this.owner) {
    console.log("can't add because this is a player stack");
    return false;
  }
  if (this.empty()) {
    return true;
  }
  var top = this.topPiece();
  if (piece.size > top.size) {
    if (piece.stack && piece.stack.owner) { // a piece is being added from off the board
      if (top.player == piece.player) { // you are trying to cover your own piece
        //console.log("can't add because i'm trying to capture my own piece from off the board")
        return false;
      }
      var lines = piece.player.game.board.linesForStack(this);
      for (var i=0; i<lines.length; i++) {
        if (lines[i].containsThree(piece.player.opponent)) {
          return true;
        }
      }
      //console.log("can't add because i'm trying to capture an opponent from off the board and they don't have 3");
      return false;
    } else {
      return true; // a piece is being moved from another place on the board
    }
  }
  //console.log("can't add because my piece doesn't fit");
  //console.log(piece.size + " > " + top.size);
  return false;
};

gobbs.Stack.prototype.removePiece = function() {
  var p = this.pieces.pop();
  p.stack = null;
  if (!this.empty()) {
    this.topPiece().setDraggable(true);
  }
  return p;
};

gobbs.Stack.prototype.topPiece = function() {
  return this.getPiece(1);
};

gobbs.Stack.prototype.getPiece = function(number) {
  return this.pieces[this.pieces.length - number];
};

gobbs.Stack.prototype.empty = function() {
  return this.pieces.length == 0;
};