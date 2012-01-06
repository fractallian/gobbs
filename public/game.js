goog.provide('gobbs.Game');

goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.Sprite');

goog.require('gobbs.Board');
goog.require('gobbs.Stack');
goog.require('gobbs.Player');
goog.require('gobbs.Move');


gobbs.Game = function() {
  lime.Scene.call(this);
  
  // this *should* be defined in Board...
  this.touchedPiece = null;

  var layer = new lime.Layer();
  var back = new lime.Sprite().setFill(100, 100, 100).setSize(1024, 768).setAnchorPoint(0, 0);
  layer.appendChild(back);
  this.appendChild(layer);

  this.pieceLayer = new lime.Layer();
  this.appendChild(this.pieceLayer);

  var top_space = 50;
  this.board = new gobbs.Board().setPosition(gobbs.Stack.size, top_space);
  this.p1 = new gobbs.Player(this, 1);
  this.p2 = new gobbs.Player(this, 2);
  this.p2.CPU = true;
  this.p1.opponent = this.p2;
  this.p2.opponent = this.p1;
  this.turn = this.p1;

  this.turn_lbl = new lime.Label().setAnchorPoint(.5, 0).setPosition(512, 10).setFontSize(30).setText(this.turnText());
  layer.appendChild(this.turn_lbl);
  layer.appendChild(this.board);

  for(var p=0; p<2; p++) {
    var player = (p == 0) ? this.p1 : this.p2;
    var x_offset = p * (gobbs.Stack.size + this.board.getSize().width);
    for(var i=0; i<3; i++) {
      var s = player.stacks[i];
      var offset = s.getSize().height / 2;
      layer.appendChild(s.setPosition(offset + x_offset, top_space + offset + (s.getSize().height * i)));
      // set the initial position of all the pieces
      for (var j=0; j<s.pieces.length; j++) {
        s.pieces[j].setPosition(s.getPosition());
      }
    }
  }
  gobbs.Game.current = this;
};
goog.inherits(gobbs.Game, lime.Scene);

gobbs.Game.prototype.toObj = function() {
  return {
    board: this.board.toObj(),
    turn: this.turn.number,
    p1: this.p1.toObj(),
    p2: this.p2.toObj()
  };
};

gobbs.Game.prototype.stackCoords = function(stack) {
  return stack.localToNode(new goog.math.Coordinate(0, 0), this.pieceLayer);
};

gobbs.Game.prototype.showMoves = function() {
  gobbs.Move.clearHighlights();
  if (this.turn == this.p2) {
    var moves = this.turn.rankedMoves();
    moves[0].highlight();
  }
};

gobbs.Game.prototype.endTurn = function() {
  this.turn = this.turn.opponent;
  this.turn_lbl.setText(this.turnText());
  if (this.turn.CPU) {
    this.turn.playMove(this.turn.rankedMoves()[0]);
  } else {
    this.showMoves();
  }
};

gobbs.Game.prototype.endGame = function(winner, line) {
  this.winner = winner;
  if (line) {
    line.highlight();
    this.winningLine = line;
  }
  var lbl = new lime.Label().setFontSize(90).setFontWeight(2).setPadding(30).setPosition(512, 384).setAnchorPoint(.5, .5);
  if (winner == this.p1) {
    lbl.setFontColor("#FFFFFF").setText("White Wins!").setFill("#000000");
  } else {
    lbl.setFontColor("#FFFFFF").setText("Black Wins!").setFill("#000000");
  }
  this.appendChild(lbl);
};

gobbs.Game.prototype.turnText = function() {
  if (this.turn == this.p1) {
    return "White's Turn";
  } else {
    return "Black's Turn";
  }
};
