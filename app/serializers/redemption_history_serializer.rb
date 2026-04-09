class RedemptionHistorySerializer
  def initialize(redemptions)
    @redemptions = redemptions
  end

  def as_json(*)
    {
      redemptions: @redemptions.map { |r| row(r) },
    }
  end

  private

  def row(redemption)
    {
      id: redemption.id,
      reward_id: redemption.reward_id,
      reward_name: redemption.reward.name,
      points_spent: redemption.points_spent,
      created_at: redemption.created_at.iso8601(3),
    }
  end
end
