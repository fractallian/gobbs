#= require ./stack
#= require ./piece

namespace "Gobbs", (ns) ->

  class ns.Player extends Backbone.Model
    initialize: (args) ->
      @number = args.number
      @game = args.game
      @stacks = _.map [1..3], (i) =>
        stack = new Gobbs.PlayerStack index: i - 1
        stack.add _.map [0..3], (size) =>
          new Gobbs.Piece size: size, player: @ 
    is_my_turn: ->
      @game.turn == @
  
  class ns.HumanPlayer extends ns.Player
    is_human: true
  
  class ns.CPUPlayer extends ns.Player
    is_human: false
    initialize: (args) ->
      super args
      @difficulty = args.difficulty
    
      