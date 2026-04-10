# frozen_string_literal: true

require "rails_helper"

RSpec.describe RedemptionService do
  def redeem_with_row_locks(user, reward)
    result = nil
    ActiveRecord::Base.transaction do
      u = User.lock.find(user.id)
      r = Reward.lock.find(reward.id)
      result = described_class.redeem_reward(u, r)
    end
    result
  end

  describe ".redeem_reward" do
    it "raises insufficient_points when balance is below cost" do
      user = User.create!(name: "Broke", point_balance: 5)
      reward = Reward.create!(name: "Pricy", description: "x", stock: 10, point_cost: 100, active: true)

      expect do
        redeem_with_row_locks(user, reward)
      end.to raise_error(RedemptionService::Unredeemable) do |e|
        expect(e.error_code).to eq(:insufficient_points)
      end
    end

    it "raises reward_not_available when reward is inactive" do
      user = User.create!(name: "Rich", point_balance: 500)
      reward = Reward.create!(name: "Off", description: "x", stock: 3, point_cost: 50, active: false)

      expect do
        redeem_with_row_locks(user, reward)
      end.to raise_error(RedemptionService::Unredeemable) do |e|
        expect(e.error_code).to eq(:reward_not_available)
      end
    end

    it "raises reward_not_available when stock is zero" do
      user = User.create!(name: "Rich", point_balance: 500)
      reward = Reward.create!(name: "Gone", description: "x", stock: 0, point_cost: 50, active: true)

      expect do
        redeem_with_row_locks(user, reward)
      end.to raise_error(RedemptionService::Unredeemable) do |e|
        expect(e.error_code).to eq(:reward_not_available)
      end
    end

    it "debits user, decrements stock, and returns updated balance" do
      user = User.create!(name: "Buyer", point_balance: 200)
      reward = Reward.create!(name: "Mug", description: "x", stock: 2, point_cost: 75, active: true)

      result = redeem_with_row_locks(user, reward)

      expect(result).to be_a(RedemptionService::RedemptionResult)
      expect(result.user.point_balance).to eq(125)
      expect(user.reload.point_balance).to eq(125)
      expect(reward.reload.stock).to eq(1)
      expect(result.redemption.points_spent).to eq(75)
    end
  end
end
