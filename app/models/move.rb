require 'invalid_move_error'

class Move < ActiveRecord::Base
  belongs_to :player

  default_scope order("created_at")

  before_create :ensure_turn_is_correct
  before_create :set_number

  protected

  def ensure_turn_is_correct
    raise InvalidMoveError, "It is not the specified player's turn" unless player.game.current_turn == player.turn
  end

  def set_number
    self.number = (player.game.moves.last.number || 0) + 1
  end
end
