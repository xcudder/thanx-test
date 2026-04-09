class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  # Public catalog filter: matches GET /rewards (active and purchasable).
  scope :available, -> { where(active: true).where("stock > 0") }
end
