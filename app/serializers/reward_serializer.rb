class RewardSerializer
  def initialize(reward)
    @reward = reward
  end

  def as_json(*)
    {
      id: @reward.id,
      name: @reward.name,
      description: @reward.description,
      photo: @reward.photo,
      stock: @reward.stock,
      point_cost: @reward.point_cost,
      active: @reward.active,
    }
  end
end
