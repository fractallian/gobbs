goog.provide('gobbs.Piece');

goog.require('lime.Circle');
goog.require('lime.fill.Stroke');
goog.require('lime.animation.MoveTo');


gobbs.Piece = function(player, size, number) {
  lime.Circle.call(this);
  this.player = player;
  this.size = size;
  this.number = number;
  var diameter = 20 + (size * 40);
  var color = (this.color() == "white") ? 255 : 0;
  this.setSize(diameter, diameter).setFill(color, color, color);

  this.player.game.pieceLayer.appendChild(this);

  this.stack = null;

  this.drag_listener = function(e) {
    if (this.player.game.winner || !this.player.isMyTurn() || (this.player.game.touchedPiece && this.player.game.touchedPiece != this)) {
      return false;
    }
    if (!this.stack.owner) {
      this.player.game.touchedPiece = this;
      if (!this.player.game.board.movesExist(this)) {
        player.game.endGame(this.player.opponent, null);
        return false;
      }
    }
    e.startDrag(true);
    this.lift();

    e.swallow(['mouseup', 'touchend'], function(e) {
      var new_stack = this.player.game.board.stackAtCoords(this.localToNode(e.position, this.player.game.board));
      this.place(new_stack);
    });
  };
};
goog.inherits(gobbs.Piece, lime.Circle);

gobbs.Piece.prototype.toObj = function() {
  return {
    number: this.number,
    size: this.size,
    player: this.player.number
  };
};

gobbs.Piece.prototype.lift = function() {
  this.player.game.pieceLayer.setChildIndex(this, 24);
  this.setStroke(new lime.fill.Stroke(2, "#FF0000"));
};

gobbs.Piece.prototype.place = function(stack) {
  var piece = this;
  if (stack && stack.canAddPiece(piece)) {
    piece.stack.removePiece();
    stack.addPiece(piece);
    piece.player.game.touchedPiece = null;
    piece.setStroke(null);

    var pos = stack.localToNode(new goog.math.Coordinate(0, 0), piece.player.game.pieceLayer);
    var snap = new lime.animation.MoveTo(pos).setDuration(.2);

    goog.events.listen(snap, lime.animation.Event.STOP, function() {
      if (!piece.player.game.board.checkWin()) {
        piece.player.game.endTurn();
      }
    });

    piece.runAction(snap);
  } else {
    if (!piece.player.game.touchedPiece) {
      piece.setStroke(null);
      var pos = piece.stack.localToNode(new goog.math.Coordinate(0, 0), piece.player.game.pieceLayer);
      piece.runAction(new lime.animation.MoveTo(pos).setDuration(.8));
    }
  }
};

gobbs.Piece.prototype.color = function() {
  return (this.player.number == 1) ? "white" : "black";
};

gobbs.Piece.prototype.setDraggable = function(can_drag) {
  if (can_drag) {
    goog.events.listen(this, ['mousedown', 'touchstart'], this.drag_listener);
  } else {
    goog.events.unlisten(this, ['mousedown', 'touchstart'], this.drag_listener);
  }
};