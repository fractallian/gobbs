namespace "Gobbs", (ns) ->

  class ns.Line extends Backbone.Model
    contains_number: (player, number) ->
      y = 0
      n = 0
      for stack in @.get('stacks')
        tp = stack.last() || null
        if tp == player
          y++
        else
          n++
        return false if n > 4 - number
        return true if y >= number
      false