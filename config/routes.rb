Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "users", to: "api/users#index"
  get "users/:id/balance", to: "api/users#balance"
  get "users/:id/redemption_history", to: "api/users#redemption_history"
  get "rewards", to: "api/rewards#index"
  post "redeem", to: "api/redemptions#redeem"

  root "home#index"
end
