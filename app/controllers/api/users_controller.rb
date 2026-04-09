module Api
  class UsersController < BaseController
    before_action :set_user, only: %i[balance redemption_history]

    def balance
      # Inline JSON: only two scalars — a serializer would add indirection without real payoff.
      render json: {
        user_id: @user.id,
        point_balance: @user.point_balance,
      }
    end

    def redemption_history
      redemptions = @user.redemptions.includes(:reward).order(created_at: :desc)
      render json: RedemptionHistorySerializer.new(redemptions).as_json
    end

    private

    def set_user
      @user = User.find(params[:id])
    end
  end
end
