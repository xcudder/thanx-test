class AddCheckConstraintsAndRewardPhoto < ActiveRecord::Migration[8.0]
  def change
    add_column :rewards, :photo, :string

    add_check_constraint :users, "point_balance >= 0", name: "users_point_balance_non_negative"
    add_check_constraint :rewards, "stock >= 0", name: "rewards_stock_non_negative"
  end
end
