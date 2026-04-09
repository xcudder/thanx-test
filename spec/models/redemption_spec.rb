# frozen_string_literal: true

require "rails_helper"

RSpec.describe Redemption, type: :model do
  describe "points_spent" do
    it "rejects nil" do
      user = User.create!(name: "u", point_balance: 100)
      reward = Reward.create!(name: "r", description: "x", stock: 1, point_cost: 10, active: true)
      redemption = Redemption.new(user: user, reward: reward, points_spent: nil)

      expect(redemption).not_to be_valid
      expect(redemption.errors[:points_spent]).to be_present
    end

    it "rejects negative values" do
      user = User.create!(name: "u", point_balance: 100)
      reward = Reward.create!(name: "r", description: "x", stock: 1, point_cost: 10, active: true)
      redemption = Redemption.new(user: user, reward: reward, points_spent: -1)

      expect(redemption).not_to be_valid
    end

    it "allows zero for free rewards" do
      user = User.create!(name: "u", point_balance: 100)
      reward = Reward.create!(name: "r", description: "x", stock: 1, point_cost: 0, active: true)
      redemption = Redemption.new(user: user, reward: reward, points_spent: 0)

      expect(redemption).to be_valid
    end
  end
end
