class Game < ActiveRecord::Base
  belongs_to :user
  belongs_to :winner, :class_name => "Player", :foreign_key => :winner_player_id
  has_many :players
  has_many :moves, :through => :players

  def current_turn
    turn = moves.last.player.turn + 1
    player_count <= turn ? 0 : turn
  end
end
