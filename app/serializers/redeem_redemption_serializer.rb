class RedeemRedemptionSerializer
  def initialize(result)
    @redemption = result.redemption
    @user = result.user
  end

  def as_json(*)
    {
      redemption: {
        id: @redemption.id,
        user_id: @user.id,
        reward_id: @redemption.reward_id,
        points_spent: @redemption.points_spent,
        created_at: @redemption.created_at.iso8601(3),
      },
      point_balance: @user.point_balance,
    }
  end
end
