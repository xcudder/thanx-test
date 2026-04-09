module Api
  class RewardsController < BaseController
    def index
      rewards = Reward.where(active: true).where("stock > 0").order(:id)
      render json: {
        rewards: rewards.map { |r| reward_json(r) },
      }
    end

    private

    def reward_json(reward)
      {
        id: reward.id,
        name: reward.name,
        description: reward.description,
        stock: reward.stock,
        point_cost: reward.point_cost,
        active: reward.active,
      }
    end
  end
end
