class InvalidMoveError < StandardError
  def message
    "This move cannot be played: #{super}"
  end
end