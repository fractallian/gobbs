class GamesController < ApplicationController
  before_filter :load_game, :only => [:show, :moves, :declare_winner]

  def create
    creator = User.get_user(params[:facebook_id])
    game = Game.transaction do
      Game.create(:user => creator, :player_count => params[:players].length).tap do |game|
        params[:players].each_with_index do |fbid, i|
          user = User.get_user(fbid)
          player = Player.create(:user => user, :game => game, :turn => i)
        end
      end
    end
    render :json => game.to_json(:include => :players)
  end

  def show
    render :json => @game.to_json(:include => [:players, :moves])
  end

  def moves
    moves = @game.moves.where(["number > ?", params[:move] || 0])
    render :json => moves
  end

  def index
    user = User.get_user(params[:facebook_id])
    render :json => user.games
  end

  def declare_winner
    @game.update_attribute(:winner_player_id, params[:player_id])
    render :json => @game
  end

  protected

  def load_game
    @game = Game.find(params[:id])
  end
end