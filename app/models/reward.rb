class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  validates :name, presence: true
  validates :point_cost, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Public catalog filter: matches GET /rewards (active and purchasable).
  scope :available, -> { where(active: true).where("stock > 0") }
end
