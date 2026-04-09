module Api
  class RewardsController < BaseController
    def index
      rewards = Reward.available.order(:id)
      render json: {
        rewards: rewards.map { |r| RewardSerializer.new(r).as_json },
      }
    end
  end
end
