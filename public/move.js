goog.provide('gobbs.Move');

goog.require('gobbs.MoveRank');

goog.require('lime.fill.Color');

gobbs.Move = function(piece, stack) {
  this.piece = piece;
  this.stack = stack;
};

gobbs.Move.highlighted = new Array();

gobbs.Move.clearHighlights = function() {
  for (var i=0; i<gobbs.Move.highlighted.length; i++) {
    var hl = gobbs.Move.highlighted[i];
    hl.setFill(hl.origFill);
  }
  gobbs.Move.highlighted = new Array();
};

gobbs.Move.prototype.highlight = function() {
  this.piece.stack.origFill = this.piece.stack.getFill();
  this.stack.origFill = this.stack.getFill();
  this.piece.stack.setFill("#0000FF");
  this.stack.setFill("#00FF00");
  gobbs.Move.highlighted.push(this.stack);
  gobbs.Move.highlighted.push(this.piece.stack);
};

gobbs.Move.possibleMoves = function(player) {
  var moves = new Array();
  var pieces = player.playablePieces();
  for (var p=0; p<pieces.length; p++) {
    var piece = pieces[p];
    for (var r=0; r<4; r++) {
      for (var c=0; c<4; c++) {
        var stack = player.game.board.grid[r][c];
        if (stack.canAddPiece(piece)) {
          moves.push(new gobbs.Move(piece, stack));
        }
      }
    }
  }
  return moves;
};

gobbs.Move.prototype.blocks = function(move) {
  if (move.stack == this.stack && this.piece.size >= move.piece.size) {
    return true;
  }
  return false;
};

gobbs.Move.prototype.captures = function() {
  var tp = this.stack.topPiece();
  return (tp && tp.player != this.piece.player) ? true : false;
};

gobbs.Move.prototype.blocksFour = function(line) {  
  // is this piece the same size or larger than any of the opponent's playable pieces
  var opp_pieces = this.piece.player.opponent.playablePieces();
  for (var p=0; p<opp_pieces.length; p++) {
    if (!line.containsPiece(opp_pieces[p])) {
      if (this.piece.size >= opp_pieces[p].size) {
        return true;
      }
    }
  }
  return false;
};

gobbs.Move.prototype.createsFour = function(line) {
  return this.createsNumber(line, 4);
};

gobbs.Move.prototype.createsThree = function(line) {
  return this.createsNumber(line, 3);
};

gobbs.Move.prototype.createsTwo = function(line) {
  return this.createsNumber(line, 2);
};

gobbs.Move.prototype.createsNumber = function(line, number) {
  var tp = this.stack.topPiece();

  if ((!tp || tp.player != this.piece.player) && line.containsNumber(this.piece.player, number - 1)) {
    if (line.containsStack(this.stack)) { // moving to another stack in the same line
      var under = this.piece.stack.getPiece(2);
      if (under && under.player == this.piece.player) { // my piece is under the one being moved
        return true;
      }
      return false;
    }
    return true;
  }
  return false;
};

// // counts the number of opponent's pieces that would be in the specified line after this move is made
// gobbs.Move.prototype.opponentNumber = function(line) {
//   var num = 0;
//   for (var i=0; i<4; i++) {
//     if (line.stacks[i] == this.piece.stack) { // the stack we are moving from
//       var under = this.piece.stack.getPiece(2);
//       if (under && under.player == this.piece.opponent) { // the piece underneath is the opponent's
//         num++;
//       }
//     } else if (line.stacks[i] != this.stack) { // the opponent can't own the stack we are moving to
//       if (line.stacks[i].topPiece().player == this.piece.opponent) {
//         num++;
//       }
//     }
//   }
//   return num;
// };

// // counts the number of my pieces that would be in the specified line after this move is made
// gobbs.Move.prototype.myNumber = function(line) {
//   var num = 0;
//   for (var i=0; i<4; i++) {
//     if (line.stacks[i] == this.piece.stack) { // the stack we are moving from
//       var under = this.piece.stack.getPiece(2);
//       if (under && under.player == this.piece.player) { // the piece underneath is mine
//         num++;
//       }
//     } else if (line.stacks[i] == this.stack) { // we will own the stack we are moving to
//       num++;
//     } else {
      
//     }
//       if (line.stacks[i].topPiece().player == this.piece.opponent) {
//         num++;
//       }
//     }
//   }
//   return num;
// };

// counts the number of each player's pieces in the specifed line after the move is made
gobbs.Move.prototype.pieceCounts = function(line) {
  var counts = {mine: 0, opponent: 0};
  for (var i=0; i<4; i++) {
    if (line.stacks[i] == this.piece.stack) { // the stack we are moving from
      var under = this.piece.stack.getPiece(2);
      if (under){
        if (under.player == this.piece.player) { // the piece underneath is mine
          counts.mine++;
        } else {
          counts.opponent++;
        }
      }
    } else if (line.stacks[i] == this.stack) { // we will own the stack we are moving to
      counts.mine++;
    } else { // this stack is unchanged
      var tp = line.stacks[i].topPiece();
      if (tp) {
        if (tp.player == this.piece.player) { // the top piece is mine
          counts.mine++;
        } else {
          counts.opponent++;
        }
      }
    }
  }
  return counts;
};

// gobbs.Move.prototype.outcome = function() {
//   var lines = this.stack.getLines(); // get lines for destination stack
//   if (!this.piece.stack.owner) { // if the origin is on the board
//     goog.array.concat(lines, this.piece.stack.getLines()); // get the lines for the origin stack
//     goog.array.removeDuplicates(lines); // no need to analyze lines twice
//   }
//   var affected = new Array();
//   for (var l=0; l<lines.length; l++) {
//     var line = lines[l];
//     var row = new Array();
//     for (var i=0; i<4; i++) {
//       if (line.stacks[i] == this.piece.stack) { // the stack we are moving from
//         var under = this.piece.stack.getPiece(2);
//         if (under){
//           if (under.player == this.piece.player) { // the piece underneath is mine
//             row.push({p:"X",s:under.size});
//           } else {
//             row.push({p:"O",s:under.size});
//           }
//         } else {
//           row.push(null);
//         }
//       } else if (line.stacks[i] == this.stack) { // we will own the stack we are moving to
//         row.push({p:"X",s:this.piece.size});
//       } else { // this stack is unchanged
//         var tp = line.stacks[i].topPiece();
//         if (tp) {
//           if (tp.player == this.piece.player) { // the top piece is mine
//             row.push({p:"X",s:tp.size});
//           } else {
//             row.push({p:"O",s:tp.size});
//           }
//         } else {
//           row.push(null);
//         }
//       }
//     }
//     affected.push(row);
//   }
//   return affected;
// };

// gobbs.Move.prototype.outcome = function() {
//   var board = this.piece.player.game.board.toObj();
//   if (this.piece.stack.owner) {
//     var piece = this.piece.toObj();
//   } else {
//     var piece = board[this.piece.stack.row][this.piece.stack.col].pop();
//   }
//   board[this.stack.row][this.stack.col].push(piece);
//   return board;
// };

// returns the difference in 
gobbs.Move.pieceCountDiffs = function(before, after) {
  var diffs = {
    4: 0,
    3: 0,
    2: 0
  };
  for (var i=2; i<5; i++) {
    // opponent gains i in a line or i lose i in a line
    if ((before.opponent < i && after.opponent == i) || (before.mine == i && after.mine < i)) { 
      diffs[i]--;
    }
    // i gain i in a line or oppponent loses i in a line
    if ((before.mine < i && after.mine == i) || (before.opponent == i && after.opponent < i)) {
      diffs[i]++;
    }
    return diffs;
  }
};

gobbs.Move.prototype.getRank = function() {
  return this.rank = new gobbs.MoveRank(this);
  // victory  prevents loss
  // prevent  prevents loss
  // setup    sets up a win
  // capture  captures opponent's piece
  // three    makes three in line
  // two      makes two in line
  // position strategic position
  // size     piece size
  // random   tie-breaker

  // check for captures (not line-specific, can use later)
  // var captures = this.captures();
  // if (captures) {
  //   var captured = this.stack.topPiece();
  //   this.rank.capture = (4 - (this.piece.size - captured.size)) + captured.size;
  //   if (this.piece.stack.owner) { 
  //     this.rank.capture += 7; // capturing from off the board is best
  //   }
  // }

  // // check the lines we are moving from
  // if (!this.piece.stack.owner) { // only check if piece is on the board
  //   var lines = this.piece.stack.getLines(); // get the lines for the piece being moved
  //   for(var i=0; i<lines.length; i++) {
  //     var before = line.pieceCounts();
  //     var after = this.pieceCounts(lines[i]);
  //     var diffs = gobbs.Move.pieceCountDiffs(before, after);
  //     this.victory = diffs[4];
  //     if (this.victory != 0) {
  //       return this.victory;
  //     }
  //     this.rank.three += diffs[3];
  //     if (after.opponent == 3) {
        
  //     }
  //     this.rank.two += diffs[2];

  //   }
  // }

  // check the lines we are moving to
  // var lines = this.stack.getLines(); // get the lines for the destination stack
  // for(var i=0; i<lines.length; i++) {
  //   var before = line.pieceCounts();
  //   var after = this.pieceCounts(lines[i]);
  //   var diffs = gobbs.Move.pieceCountDiffs(before, after);
  //   this.victory = diffs[4];
  //   if (this.victory > 0) {
  //     return this.victory;
  //   }
  //   this.rank.three += diffs[3];
  //   this.rank.two += diffs[2];
  // }

  // // check for prevent loss
  // if (line.canPlayToWin(this.piece.player.opponent)) {
  //   console.log("opponent can play to win!");
  //   // if this move captures an opponent, then it must prevent 4
  //   if (captures) {
  //     if (this.rank[3] > 0) { // moving from off the board is best
  //       this.rank[2] += 7;
  //     } else {
  //       this.rank[2] += 6; // capturing from on board is second best
  //     }
  //   } else if (this.blocksFour(line)) {
  //     this.rank[2] += 5; // also good
  //   }
  // }

  // check strategic position
  // this.rank.position = this.stack.lines.length;

  // // check piece size
  // this.rank.size = 4 - this.piece.size;

  // check for reveal
  // if (!this.piece.stack.owner) { // only check if piece is on the board
  //   var lines = this.piece.stack.getLines(); // get the lines for the piece being moved
  //   for(var i=0; i<lines.length; i++) {
  //     var covers_another = (captures && lines[i].containsStack(this.stack)) ? true : false; // are we moving to cover another piece in this line?
  //     if (this.piece.stack.pieces.length > 1 && this.piece.stack.getPiece(2).player != this.piece.player) { // if there is a piece under the one being moved and that piece is the opponent's
  //       if (lines[i].containsThree(this.piece.player.opponent)) { // and the opponent has three in this line
  //         if (!covers_another) { // and we aren't moving to another stack in this line
  //           return this.rank[0] = -1; // we'd lose by moving this piece
  //         }
  //         this.rank[5] -= 1; // we still leave three in a row
  //       }
  //       if (lines[i].containsTwo(this.piece.player.opponent)) {
  //         if (!covers_another) { // and we aren't moving to another stack in this line
  //           this.rank[5] -= 1; // we'd reveal three in a line
  //         }
  //         this.rank[6] -= 1; // we'd reveal two in a line
  //       }
  //       if (lines[i].containsOne(this.piece.player.opponent)) {
  //         this.rank[6] -= 1; // we'd reveal two in a line (you can't cover another)
  //       }
  //     } else if (this.piece.stack.pieces.length == 1) { // if there's nothing under this piece
  //       if (!covers_another && lines[i].containsThree(this.piece.player.opponent)) { // the opponent has three in a row and i'm not covering one of them
  //         this.rank[2] -= 1; // i'd lose next turn if i left this exposed
  //       }
  //       if (!covers_another && lines[i].containsTwo(this.piece.player.opponent)) { // the opponent has three in a row and i'm not covering one of them
  //         this.rank[6] -= 1;
  //       }
  //       if (lines[i].containsThree(this.piece.player)) { // i have three in this line (we don't check for moving to the same line because that will cancel out later)
  //         this.rank[5] -= 1;
  //       }
  //       if (lines[i].containsTwo(this.piece.player)) { // i have two in this line (we don't check for moving to the same line because that will cancel out later)
  //         this.rank[6] -= 1;
  //       }
  //     }
  //   }
  // }

  // var lines = this.stack.getLines();
  // for(var l=0; l<lines.length; l++) {
  //   var line = lines[l];
    
  //   // check for win
  //   if (this.createsFour(line)) {
  //     return this.rank[1] = 1;
  //   }

  //   // check for capture from off board
  //   if (captures && line.containsThree(this.piece.player.opponent)) {
  //     if (this.piece.stack.owner) { // can capture from off board (win already blocked)
  //       this.rank[3] += 1;
  //     }
  //   }

  //   // check for prevent loss
  //   if (line.canPlayToWin(this.piece.player.opponent)) {
  //     console.log("opponent can play to win!");
  //     // if this move captures an opponent, then it must prevent 4
  //     if (captures) {
  //       if (this.rank[3] > 0) { // moving from off the board is best
  //         this.rank[2] += 7;
  //       } else {
  //         this.rank[2] += 6; // capturing from on board is second best
  //       }
  //     } else if (this.blocksFour(line)) {
  //       this.rank[2] += 5; // also good
  //     }
  //   }

  //   // check for 3 in a line
  //   if (this.createsThree(line)) {
  //     this.rank[5] += 1;
  //   }

  //   // check for 2 in a line
  //   if (this.createsTwo(line)) {
  //     this.rank[6] += 1;
  //   }
  // }


};
