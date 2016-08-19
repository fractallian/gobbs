#= require ./gobbs/game
#= require ./gobbs/piece

namespace "Gobbs", (ns) ->
  # ns.scene = ->
  #   sjs.Scene({w:1024, h:768});

  class ns.Coord
    constructor: (x, y) ->
      @x = x
      @y = y
  
  class ns.Box
    @get_box: (elem) ->
      sel = $(elem)
      offset = sel.offset()
      topleft = new Gobbs.Coord offset.left, offset.top
      bottomright = new Gobbs.Coord offset.left + sel.width(), offset.top + sel.height()
      new Gobbs.Box topleft, bottomright
    constructor: (topleft, bottomright) ->
      @top = topleft.y
      @bottom = bottomright.y
      @left = topleft.x
      @right = bottomright.x
      throw "Invalid box" if @top >= @bottom || @left >= @right
    contains: (coord) ->
      (@top <= coord.y && @bottom >= coord.y) && (@left <= coord.x && @right >= coord.x)

    


  ns.start = ->
    # Gobbs.KineticView.stage = new Kinetic.Stage "container", 1024, 768
    @scene = sjs.Scene w: 1024, h: 768, parent: $('#scene')[0]
    @input = @scene.Input()
    @piece_layer = @scene.Layer "piece"

    # @piece_layer.dom.onclick = (e) ->
      

    # console.log @.input.mouse

    g = new Gobbs.CPUGame
      first_turn: 0,
      difficulty: 3

    for piece in g.pieces
      pv = new Gobbs.PieceView model: piece
      pv.render()
      # new Gobbs.PieceView
    # console.log g.player1.stacks # .attributes #.stacks #.get('stacks') # .get("stacks")
    # console.log g.board.stacks[0][0].can_add_piece g.player2.stacks[0].first()

    # piece = g.player2.stacks[0].first()

    # console.log piece

    # console.log piece.is_on_board()

    # piece.move 2, 3

    # pv = new Gobbs.PieceView model: piece
    # pv.set_draggable(true)
    # pv.render()
    

    # console.log piece

    # console.log piece.is_on_board()

    # console.log g.board.lines[0].contains_number(null, 2)

    # console.log g.board.stacks[0][1].lines

# $(document).ready ->
#   Gobbs.start()


# $('.stack').live 'click', ->
#   setTimeout ->
#     console.log $(@).offset()
#   , 1000

$('#game').live 'pageinit', ->
  setTimeout ->
    Gobbs.start()
  , 30
  # $(document).ready ->
  #   Gobbs.start()
  $('.start').click ->
    $.mobile.changePage $('#game')
    