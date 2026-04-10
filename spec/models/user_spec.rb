# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  it "requires a name" do
    expect(described_class.new(name: "", point_balance: 0)).not_to be_valid
  end

  it "requires a non-negative integer point_balance" do
    expect(described_class.new(name: "A", point_balance: -1)).not_to be_valid
    expect(described_class.new(name: "A", point_balance: 1.5)).not_to be_valid
  end
end
