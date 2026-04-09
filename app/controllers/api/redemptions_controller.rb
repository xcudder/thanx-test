module Api
  class RedemptionsController < BaseController
    def redeem
      result = Redemptions::RedeemReward.call(
        user_id: redeem_params[:user_id],
        reward_id: redeem_params[:reward_id],
      )
      render json: {
        redemption: {
          id: result.redemption.id,
          user_id: result.user.id,
          reward_id: result.redemption.reward_id,
          points_spent: result.redemption.points_spent,
          created_at: result.redemption.created_at.iso8601(3),
        },
        point_balance: result.user.point_balance,
      }, status: :created
    rescue Redemptions::RedeemReward::Unprocessable => e
      render json: { error: e.code.to_s }, status: :unprocessable_content
    end

    private

    def redeem_params
      params.permit(:user_id, :reward_id)
    end
  end
end
