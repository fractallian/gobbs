class Player < ActiveRecord::Base
  belongs_to :user
  belongs_to :game
  has_many :moves
end
