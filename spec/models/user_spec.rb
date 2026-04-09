# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  describe "point_balance CHECK constraint" do
    it "rejects negative balances at the database" do
      user = User.create!(name: "Test", point_balance: 0)

      expect { user.update!(point_balance: -1) }.to raise_error(ActiveRecord::StatementInvalid)
    end
  end
end
