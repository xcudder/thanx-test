# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Thanx HTTP API", type: :request do
  describe "GET /users/:id/balance" do
    it "returns the user's point balance" do
      user = User.create!(name: "Ada", point_balance: 1200)

      get "/users/#{user.id}/balance"

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json["user_id"]).to eq(user.id)
      expect(json["point_balance"]).to eq(1200)
    end

    it "returns 404 when the user does not exist" do
      get "/users/999999/balance"

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("not_found")
    end
  end

  describe "GET /rewards" do
    it "returns only active rewards with stock > 0" do
      Reward.create!(name: "In stock", description: "x", stock: 3, point_cost: 100, active: true)
      Reward.create!(name: "Out of stock", description: "x", stock: 0, point_cost: 50, active: true)
      Reward.create!(name: "Inactive", description: "x", stock: 5, point_cost: 10, active: false)

      get "/rewards"

      expect(response).to have_http_status(:ok)
      names = response.parsed_body["rewards"].map { |r| r["name"] }
      expect(names).to contain_exactly("In stock")
    end

    it "returns reward fields needed by clients" do
      r = Reward.create!(
        name: "Mug",
        description: "Ceramic",
        photo: "https://example.com/mug.jpg",
        stock: 2,
        point_cost: 75,
        active: true,
      )

      get "/rewards"

      row = response.parsed_body["rewards"].first
      expect(row).to include(
        "id" => r.id,
        "name" => "Mug",
        "description" => "Ceramic",
        "photo" => "https://example.com/mug.jpg",
        "stock" => 2,
        "point_cost" => 75,
        "active" => true,
      )
    end

    it "returns an empty rewards array when no rewards qualify" do
      Reward.create!(name: "Out", description: "x", stock: 0, point_cost: 1, active: true)

      get "/rewards"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["rewards"]).to eq([])
    end
  end

  describe "POST /redeem" do
    let(:user) { User.create!(name: "Bea", point_balance: 500) }
    let(:reward) { Reward.create!(name: "Badge", description: "x", stock: 2, point_cost: 100, active: true) }

    it "creates a redemption, debits the user, and decrements stock in one transaction" do
      post "/redeem",
        params: { user_id: user.id, reward_id: reward.id },
        headers: { "CONTENT_TYPE" => "application/json" },
        as: :json

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json["point_balance"]).to eq(400)
      expect(json["redemption"]["points_spent"]).to eq(100)
      expect(json["redemption"]["user_id"]).to eq(user.id)
      expect(json["redemption"]["reward_id"]).to eq(reward.id)
      expect(json["redemption"]["id"]).to be_a(Integer)
      expect(json["redemption"]["created_at"]).to match(/\A\d{4}-\d{2}-\d{2}T/)

      expect(user.reload.point_balance).to eq(400)
      expect(reward.reload.stock).to eq(1)
      expect(Redemption.count).to eq(1)
    end

    it "returns 422 and rolls back when the user cannot afford the reward" do
      poor = User.create!(name: "Cam", point_balance: 10)

      post "/redeem",
        params: { user_id: poor.id, reward_id: reward.id },
        as: :json

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to eq("insufficient_points")

      expect(poor.reload.point_balance).to eq(10)
      expect(reward.reload.stock).to eq(2)
      expect(Redemption.count).to eq(0)
    end

    it "returns 422 and rolls back when the reward is out of stock" do
      empty = Reward.create!(name: "Gone", description: "x", stock: 0, point_cost: 1, active: true)

      post "/redeem",
        params: { user_id: user.id, reward_id: empty.id },
        as: :json

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to eq("reward_not_available")

      expect(user.reload.point_balance).to eq(500)
      expect(Redemption.count).to eq(0)
    end

    it "returns 422 when the reward is inactive" do
      inactive = Reward.create!(name: "Off", description: "x", stock: 3, point_cost: 50, active: false)

      post "/redeem",
        params: { user_id: user.id, reward_id: inactive.id },
        as: :json

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to eq("reward_not_available")

      expect(user.reload.point_balance).to eq(500)
      expect(inactive.reload.stock).to eq(3)
      expect(Redemption.count).to eq(0)
    end

    it "returns 404 when the user id is unknown" do
      post "/redeem",
        params: { user_id: 0, reward_id: reward.id },
        as: :json

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("not_found")
    end

    it "returns 404 when the reward id is unknown" do
      post "/redeem",
        params: { user_id: user.id, reward_id: 0 },
        as: :json

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("not_found")
    end

    it "rejects a second redeem when only one unit was left" do
      solo = Reward.create!(name: "Last one", description: "x", stock: 1, point_cost: 50, active: true)
      u1 = User.create!(name: "One", point_balance: 200)
      u2 = User.create!(name: "Two", point_balance: 200)

      post "/redeem", params: { user_id: u1.id, reward_id: solo.id }, as: :json
      expect(response).to have_http_status(:created)

      post "/redeem", params: { user_id: u2.id, reward_id: solo.id }, as: :json
      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to eq("reward_not_available")

      expect(solo.reload.stock).to eq(0)
      expect(Redemption.where(reward_id: solo.id).count).to eq(1)
    end

    context "when service validation is bypassed (simulates a bug; DB CHECK is last resort)" do
      before do
        allow_any_instance_of(RedemptionService).to receive(:validate_redeem!).and_return(nil)
      end

      it "returns 500 and rolls back if point_balance would go negative" do
        poor = User.create!(name: "Low", point_balance: 10)

        post "/redeem", params: { user_id: poor.id, reward_id: reward.id }, as: :json

        expect(response).to have_http_status(:internal_server_error)
        expect(response.parsed_body["error"]).to eq("integrity_error")
        expect(poor.reload.point_balance).to eq(10)
        expect(reward.reload.stock).to eq(2)
        expect(Redemption.count).to eq(0)
      end

      it "returns 500 and rolls back if stock would go negative" do
        empty_r = Reward.create!(name: "Zero", description: "x", stock: 0, point_cost: 50, active: true)
        rich = User.create!(name: "Rich", point_balance: 500)

        post "/redeem", params: { user_id: rich.id, reward_id: empty_r.id }, as: :json

        expect(response).to have_http_status(:internal_server_error)
        expect(response.parsed_body["error"]).to eq("integrity_error")
        expect(rich.reload.point_balance).to eq(500)
        expect(empty_r.reload.stock).to eq(0)
        expect(Redemption.count).to eq(0)
      end
    end
  end

  describe "GET /users/:id/redemption_history" do
    it "returns redemptions newest first with reward name" do
      user = User.create!(name: "Dee", point_balance: 1000)
      r1 = Reward.create!(name: "A", description: "", stock: 5, point_cost: 10, active: true)
      r2 = Reward.create!(name: "B", description: "", stock: 5, point_cost: 20, active: true)
      Redemption.create!(user: user, reward: r1, points_spent: 10)
      Redemption.create!(user: user, reward: r2, points_spent: 20)

      get "/users/#{user.id}/redemption_history"

      expect(response).to have_http_status(:ok)
      rows = response.parsed_body["redemptions"]
      expect(rows.length).to eq(2)
      expect(rows.first["reward_name"]).to eq("B")
      expect(rows.first["points_spent"]).to eq(20)
      expect(rows.first["reward_id"]).to eq(r2.id)
      expect(rows.first["id"]).to be_a(Integer)
      expect(rows.first["created_at"]).to match(/\A\d{4}-\d{2}-\d{2}T/)
      expect(rows.second["reward_name"]).to eq("A")
    end

    it "loads reward names without an N+1 (at most one SELECT touching rewards)" do
      user = User.create!(name: "Dee", point_balance: 1000)
      r1 = Reward.create!(name: "A", description: "", stock: 5, point_cost: 10, active: true)
      r2 = Reward.create!(name: "B", description: "", stock: 5, point_cost: 20, active: true)
      Redemption.create!(user: user, reward: r1, points_spent: 10)
      Redemption.create!(user: user, reward: r2, points_spent: 20)

      reward_selects = []
      sub = ActiveSupport::Notifications.subscribe("sql.active_record") do |*_, payload|
        next if %w[SCHEMA CACHE].include?(payload[:name].to_s)

        sql = payload[:sql].to_s
        reward_selects << sql if /SELECT/i.match?(sql) && /"rewards"/.match?(sql)
      end

      get "/users/#{user.id}/redemption_history"

      ActiveSupport::Notifications.unsubscribe(sub)

      expect(response).to have_http_status(:ok)
      expect(reward_selects.size).to eq(1),
        "expected a single SELECT involving rewards, got #{reward_selects.size}: #{reward_selects.inspect}"
    end

    it "returns an empty list when there are no redemptions" do
      user = User.create!(name: "Eve", point_balance: 0)

      get "/users/#{user.id}/redemption_history"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["redemptions"]).to eq([])
    end

    it "returns 404 when the user does not exist" do
      get "/users/999999/redemption_history"

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body["error"]).to eq("not_found")
    end
  end
end
