# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120113003110) do

  create_table "games", :force => true do |t|
    t.integer  "user_id"
    t.integer  "player_count"
    t.integer  "winner_player_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "games", ["user_id"], :name => "index_games_on_user_id"

  create_table "moves", :force => true do |t|
    t.integer  "player_id"
    t.integer  "number"
    t.text     "payload"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "moves", ["player_id"], :name => "index_moves_on_player_id"

  create_table "players", :force => true do |t|
    t.integer  "user_id"
    t.integer  "game_id"
    t.integer  "turn"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "players", ["game_id"], :name => "index_players_on_game_id"
  add_index "players", ["user_id"], :name => "index_players_on_user_id"

  create_table "users", :force => true do |t|
    t.integer  "facebook_id", :limit => 8
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email"
  add_index "users", ["facebook_id"], :name => "index_users_on_facebook_id"

end
