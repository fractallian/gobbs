# namespace "Gobbs", (ns) ->

#   class ns.KineticView extends Backbone.View
#     el: $('#container')
#     render: ->
#       Gobbs.KineticView.stage.add @shape
#     initialize: ->
#       @shape.view = @
#       events = ['mouseover', 'mousemove', 'mouseout', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchmove', 'touchend', 'dbltap']
#       for name in events
#         @shape.on name, (e) ->
#           @view.trigger name, e