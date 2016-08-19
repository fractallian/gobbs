#= require ./piece

namespace "Gobbs", (ns) ->

  class ns.Stack extends Backbone.Collection
    lines: []
    initialize: (args) ->
      super args
      @col = args.col
      @row = args.row
    can_add_piece: (piece) ->
      top = @last()
      return true if !top
      if piece.size > top.size
        if !piece.is_on_board()
          return false if top.player == piece.player # trying to cover own piece
          for l in @lines
            return true if l.contains_number piece.player.opponent, 3
          return false # on board, but opponent doesn't have 3
        return true # piece is on board
      return false # piece is too small

  class ns.PlayerStack extends ns.Stack
    initialize: (args) ->
      super args
      @index = args.index
    can_add_piece: (piece) ->
      false
    