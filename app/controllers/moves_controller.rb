class MovesController < ApplicationController
  def create
    player = Player.find(params[:player_id])
    move = Move.create(:player => player, :payload => params[:payload])
    render :json => move
  end
end
