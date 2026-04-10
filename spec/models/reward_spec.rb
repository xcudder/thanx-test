# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reward do
  it "requires a name" do
    expect(described_class.new(name: "", description: "x", stock: 1, point_cost: 1, active: true)).not_to be_valid
  end

  it "requires non-negative integer point_cost and stock" do
    expect(described_class.new(name: "R", description: "x", stock: -1, point_cost: 10, active: true)).not_to be_valid
    expect(described_class.new(name: "R", description: "x", stock: 1, point_cost: -1, active: true)).not_to be_valid
  end
end
