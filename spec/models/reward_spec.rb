# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reward, type: :model do
  describe "stock CHECK constraint" do
    it "rejects negative stock at the database" do
      reward = Reward.create!(
        name: "Item",
        description: "x",
        stock: 0,
        point_cost: 1,
        active: true,
      )

      expect { reward.update!(stock: -1) }.to raise_error(ActiveRecord::StatementInvalid)
    end
  end
end
