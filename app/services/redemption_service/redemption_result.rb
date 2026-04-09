class RedemptionService::RedemptionResult
  attr_reader :redemption, :user

  def initialize(redemption:, user:)
    @redemption = redemption
    @user = user
  end
end
