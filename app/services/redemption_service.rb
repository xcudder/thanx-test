class RedemptionService
  # +user+ and +reward+ must be loaded with +lock+ inside the caller's transaction.
  def self.redeem_reward(user, reward)
    new(user: user, reward: reward).redeem_reward
  end

  def initialize(user:, reward:)
    @user = user
    @reward = reward
  end

  def redeem_reward
    validate_redeem!

    cost = @reward.point_cost
    @user.update!(point_balance: @user.point_balance - cost)
    @reward.update!(stock: @reward.stock - 1)
    redemption = Redemption.create!(user: @user, reward: @reward, points_spent: cost)

    RedemptionResult.new(redemption: redemption, user: @user.reload)
  end

  private

  def validate_redeem!
    unless @reward.active? && @reward.stock.positive?
      raise Unredeemable.new(:reward_not_available)
    end
    if @user.point_balance < @reward.point_cost
      raise Unredeemable.new(:insufficient_points)
    end
  end
end
