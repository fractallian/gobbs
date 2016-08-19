namespace "Gobbs", (ns) ->



  class ns.SpriteView extends Backbone.View
    is_draggable: false
    is_dragging: false
    sprite: null
    el: ->
      @sprite.dom
    sel: ->
      $(@el())
    render: ->
      @sprite.update()
    _onmove: (e) =>
      @sprite.move((@_coords[0] - e.pageX) * -1, (@_coords[1] - e.pageY) * -1)
      @_setcoords(e)
      @sprite.update()
    _startdrag: (e) =>
      console.log @
      @is_dragging = true
      @_setcoords(e)
      $('body').bind "vmousemove", @_onmove
      $(@sprite.dom).trigger "startdrag", e
      # if @model.lift()
      #   
      #   $(@sprite.dom).css('z-index', 2)
      #   
    _enddrag: (e) =>
      if @is_dragging
        @is_dragging = false
        $('body').unbind "vmousemove", @_onmove
        $(@sprite.dom).trigger "enddrag", e

      # e.stopImmediatePropagation()
      # if @model.lifted()
      #   

      #   @model.drop @_get_stack()
      #   $(@sprite.dom).css('z-index', 1)
      #   
    _setcoords: (e) ->
      @_coords = [e.pageX, e.pageY]
    set_draggable: (draggable) ->
      console.log "set draggable"
      if draggable
        @is_draggable = true
        @sel().bind "vmousedown", @_startdrag
        # if !SpriteView._mouse_up_bound
        $('body').bind "vmouseup", @_enddrag
          # SpriteView._mouse_up_bound = true
      else
        @is_draggable = false
        @sel().unbind "vmousedown", @_startdrag
        $('body').unbind "vmouseup", @_enddrag
    _topleft: ->
      new Gobbs.Coord @sprite.x, @sprite.y
    _bottomright: ->
      new Gobbs.Coord @sprite.x + @sprite.w, @sprite.y + @sprite.h
    box: ->
      new Gobbs.Box @_topleft(), @_bottomright()
    center: ->
      new Gobbs.Coord @sprite.x + (@sprite.w / 2), @sprite.y + (@sprite.h / 2)
    is_placed_on: (elem) ->
      box = Gobbs.Box.get_box(elem)
      box.contains @center()
      # elem = $($($(".row")[r]).children(".stack")[c])
      
      # console.log box
      # console.log @sprite.center()
      



