class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy
end
