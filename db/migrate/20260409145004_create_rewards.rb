class CreateRewards < ActiveRecord::Migration[8.0]
  def change
    create_table :rewards do |t|
      t.string :name, null: false
      t.text :description, null: false, default: ""
      t.integer :stock, null: false, default: 0
      t.integer :point_cost, null: false, default: 0
      t.boolean :active, null: false, default: true

      t.timestamps
    end
  end
end
