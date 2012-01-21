class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.integer :user_id
      t.integer :game_id
      t.integer :turn

      t.timestamps
    end

    add_index :players, :game_id
    add_index :players, :user_id
  end
end
