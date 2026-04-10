module Api
  class RedemptionsController < BaseController
    # Row-level locks on User and Reward serialize concurrent redeems that touch the same rows.
    # Without them, two requests could both read stale balance/stock, pass validation, and corrupt
    # state (e.g. double-spend the last unit). +lock.find+ holds until the transaction commits.
    # The transaction must wrap +set_user+, +set_reward+, and +redeem+ so locks stay in scope.
    around_action :with_redeem_transaction, only: [:redeem]
    before_action :set_user, only: [:redeem]
    before_action :set_reward, only: [:redeem]

    rescue_from RedemptionService::Unredeemable do |e|
      render json: { error: e.error_code.to_s }, status: :unprocessable_content
    end

    # CHECK constraints etc. — should not fire if validation runs; keeps JSON API on failure.
    rescue_from ActiveRecord::StatementInvalid do
      render json: { error: "integrity_error" }, status: :internal_server_error
    end

    def redeem
      result = RedemptionService.redeem_reward(@user, @reward)
      render json: RedeemResponseSerializer.new(result).as_json, status: :created
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
