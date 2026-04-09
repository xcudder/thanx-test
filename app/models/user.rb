class User < ApplicationRecord
  has_many :redemptions, dependent: :destroy
end
