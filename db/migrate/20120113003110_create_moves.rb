class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.integer :player_id
      t.integer :number
      t.text :payload

      t.timestamps
    end

    add_index :moves, :player_id
  end
end
