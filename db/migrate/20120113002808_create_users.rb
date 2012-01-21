class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.column :facebook_id, :bigint
      t.string :name
      t.string :email

      t.timestamps
    end

    add_index :users, :facebook_id, :unique => true
    add_index :users, :email
  end
end
