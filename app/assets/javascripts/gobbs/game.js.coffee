#= require ./player
#= require ./board

namespace "Gobbs", (ns) ->

  class ns.Game extends Backbone.Model
    pieces: []
    initialize: (args) ->
      @player1 = new Gobbs.HumanPlayer game: @, number: 1
      @player2 = @_player2 args
      @players = [@player1, @player2]
      @turn = @players[args.first_turn || 0]
      @board = new Gobbs.Board()

  class ns.VsGame extends ns.Game
    _player2: (args) ->
      new Gobbs.Player game: @, number: 2
  
  class ns.CPUGame extends ns.Game
    difficulty: 0
    initialize: (args) ->
      super args
      @difficulty = args.difficulty
    _player2: (args) ->
      new Gobbs.CPUPlayer game: @, difficulty: args.difficulty, number: 2

  class ns.OnlineGame extends ns.Game
