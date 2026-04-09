module Api
  class RedemptionsController < BaseController
    # +lock.find+ row locks are held until the DB transaction ends; the transaction must
    # therefore wrap these before_actions as well as +redeem+.
    around_action :with_redeem_transaction, only: [:redeem]
    before_action :set_user, only: [:redeem]
    before_action :set_reward, only: [:redeem]

    rescue_from RedemptionService::Unredeemable do |e|
      render json: { error: e.error_code.to_s }, status: :unprocessable_content
    end

    def redeem
      result = RedemptionService.redeem_reward(@user, @reward)
      render json: RedeemRedemptionSerializer.new(result).as_json, status: :created
    end

    private

    def with_redeem_transaction
      ActiveRecord::Base.transaction { yield }
    end

    def set_user
      @user = User.lock.find(redeem_params[:user_id])
    end

    def set_reward
      @reward = Reward.lock.find(redeem_params[:reward_id])
    end

    def redeem_params
      params.permit(:user_id, :reward_id)
    end
  end
end
