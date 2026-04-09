class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  validates :points_spent, presence: true,
    numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
