module Api
  class UsersController < BaseController
    before_action :set_user, only: %i[balance redemption_history]

    def balance
      render json: {
        user_id: @user.id,
        point_balance: @user.point_balance,
      }
    end

    def redemption_history
      redemptions = @user.redemptions.includes(:reward).order(created_at: :desc)
      render json: {
        redemptions: redemptions.map { |r| redemption_json(r) },
      }
    end

    private

    def set_user
      @user = User.find(params[:id])
    end

    def redemption_json(redemption)
      {
        id: redemption.id,
        reward_id: redemption.reward_id,
        reward_name: redemption.reward.name,
        points_spent: redemption.points_spent,
        created_at: redemption.created_at.iso8601(3),
      }
    end
  end
end
