class CreateBorads < ActiveRecord::Migration[6.1]
  def change
    create_table :borads do |t|
      t.integer :number_of_people
      t.integer :game_turn
      t.integer :resert_end
      t.text :play_data
      t.text :captured_pieces
      t.timestamps null: false
    end
  end
end
