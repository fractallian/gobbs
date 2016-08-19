#= require ./sprite_view

namespace "Gobbs", (ns) ->

  class ns.Piece extends Backbone.Model
    initialize: (args) ->
      @player = args.player
      @game = @player.game
      @size = args.size
      @game.pieces.push @
    is_on_board: ->
      @collection && @collection.board
    move: (row, col) ->
      stack = @game.board.stacks[row][col]
      if stack.can_add_piece @
        @collection.remove @
        stack.add @

        return true
      return false
    add_to: (stack) ->
      @collection.remove @
      stack.add @
    lift: ->
      true
    lifted: ->
      true
    drop: (stack) ->
      if stack.can_add_piece @
        
        console.log stack
        console.log @collection
        return true
      return false

  class ns.PieceView extends ns.SpriteView
    _get_stack: ->
      for row, r in @model.game.board.stacks
        for stack, c in row
          return stack if @is_placed_on $($(".row")[r]).children(".stack")[c]
    _drop: =>
      if @model.lifted()
        @model.drop @_get_stack()
        $(@sprite.dom).css('z-index', 1)
    initialize: (args) ->
      @sprite = Gobbs.piece_layer.Sprite("images/piece_blue_" + @model.size + ".png", {size: [140, 140]})
      offset = $($("#player" + @model.player.number + " .stack")[@model.collection.index]).offset()
      @sprite.move offset.left, offset.top
      if @model.size == 3 && @model.player.is_human && @model.player.is_my_turn()
        @set_draggable true
      @sel().bind "enddrag", @_drop
      
      