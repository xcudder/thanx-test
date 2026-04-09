module Api
  class BaseController < ActionController::API
    # JSON body for API clients instead of HTML error pages.
    rescue_from ActiveRecord::RecordNotFound do
      render json: { error: "not_found" }, status: :not_found
    end
  end
end
