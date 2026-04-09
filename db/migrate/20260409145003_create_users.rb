class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.integer :point_balance, null: false, default: 0

      t.timestamps
    end
  end
end
