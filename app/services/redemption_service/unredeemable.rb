class RedemptionService::Unredeemable < StandardError
  attr_reader :error_code

  def initialize(error_code)
    @error_code = error_code
    super(error_code.to_s)
  end
end
