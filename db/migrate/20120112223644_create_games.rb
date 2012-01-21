class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :user_id
      t.integer :player_count
      t.integer :winner_player_id
      t.timestamps
    end

    add_index :games, :user_id
  end
end
