#= require ./line
#= require ./stack

namespace "Gobbs", (ns) ->

  class ns.Board extends Backbone.Model
    initialize: ->
      @stacks = _.map [0..3], (row) ->
        _.map [0..3], (col) ->
          s = new Gobbs.Stack [], row, col
      @lines = @_lines()
    _lines: ->
      lines = []
      diag1 = []
      diag2 = []
      _.each [0..3], (i) =>
        horiz = []
        vert = []
        diag1.push @stacks[i][i]
        diag2.push @stacks[(i - 3) * -1][i]
        _.each [0..3], (j) =>
          horiz.push @stacks[i][j]
          vert.push @stacks[j][i]
        lines.push @_new_line horiz
        lines.push @_new_line vert
      lines.push @_new_line diag1
      lines.push @_new_line diag2
      return lines
    _new_line: (stacks) ->
      l = new Gobbs.Line stacks: stacks, board: @
      for s in stacks
        s.lines.push(l)
      return l