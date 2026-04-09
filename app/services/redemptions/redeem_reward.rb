module Redemptions
  class RedeemReward
    class Unprocessable < StandardError
      attr_reader :code

      def initialize(code)
        @code = code
        super(code.to_s)
      end
    end

    attr_reader :redemption, :user

    def self.call(user_id:, reward_id:)
      new(user_id: user_id, reward_id: reward_id).call
    end

    def initialize(user_id:, reward_id:)
      @user_id = user_id
      @reward_id = reward_id
    end

    def call
      ActiveRecord::Base.transaction do
        @user = User.lock.find(@user_id)
        reward = Reward.lock.find(@reward_id)
        validate!(reward)

        cost = reward.point_cost
        @user.update!(point_balance: @user.point_balance - cost)
        reward.update!(stock: reward.stock - 1)
        @redemption = Redemption.create!(user: @user, reward: reward, points_spent: cost)
      end
      @user.reload
      self
    end

    private

    def validate!(reward)
      unless reward.active? && reward.stock.positive?
        raise Unprocessable.new(:reward_not_available)
      end
      if @user.point_balance < reward.point_cost
        raise Unprocessable.new(:insufficient_points)
      end
    end
  end
end
