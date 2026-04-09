# Project journal

Brief log of iterations and how we built things. Newest entries at the bottom.

---

## Iteration 1 — Rails bootstrap

- **Goal:** New Rails app in-repo, Bundler + Yarn, SQLite, no Docker workflow (run locally; Rails still emitted optional Docker files).
- **Command:** `rails new . --database=sqlite3 --javascript=esbuild` (from empty app directory).
- **Stack:** Rails 7.1, Ruby 3.3.x, Node + Yarn; `jsbundling-rails` + esbuild; Turbo + Stimulus installed by the generator; Foreman for `bin/dev`.
- **Follow-up:** `bundle install`, `yarn install`, `bin/rails db:prepare`; smoke check with `bin/rails server` (HTTP 200 on `/`).
- **Decisions:** SQLite for simplicity (no DB server); esbuild over importmap to keep a real `package.json` / Yarn flow; React + TypeScript deferred to a later iteration (esbuild path supports it when needed).

## Iteration 2 — Exercise stack alignment

- **Goal:** Match exercise pins: Ruby **3.4.3**, Rails **8.0.2**, **React (TypeScript)** with React > 16, **SQLite** unchanged.
- **Ruby:** Set `.ruby-version` to `3.4.3`; empty asdf install dir was fixed with `rm -rf ~/.asdf/installs/ruby/3.4.3 && asdf install ruby 3.4.3` (after `asdf plugin update ruby` so 3.4.3 exists in `asdf list all ruby`).
- **Bundler:** `Gemfile` → `ruby "3.4.3"`, `gem "rails", "8.0.2"`; `config/application.rb` → `config.load_defaults 8.0`; `PATH="$HOME/.asdf/installs/ruby/3.4.3/bin:$PATH" bundle install` (avoids Bundler restarting under the wrong Ruby when shims point at 3.3.1).
- **Frontend:** `yarn add react react-dom` (19.x), `yarn add -D typescript @types/react @types/react-dom`; `tsconfig.json`; entry `app/javascript/application.tsx` with `--jsx=automatic` in `package.json` `build`; `yarn typecheck` → `tsc --noEmit`; minimal `App.tsx` mounted on `#thanx-root` in layout; removed `application.js`.
- **Verify:** `bin/rails about` (Rails 8.0.2, sqlite3), `bin/rails zeitwerk:check`, `yarn build` + `yarn typecheck`, HTTP 200 from `bin/rails server`.

## Iteration 3 — Test + Hotwire boilerplate removed

- **Tests (Minitest):** Deleted `test/` (helpers, system case, fixtures, model stubs); removed `capybara` and `selenium-webdriver` from `Gemfile`; `bundle install`. Added `config.generators { |g| g.test_framework false }` so generators don’t recreate Minitest files. Left `config/environments/test.rb` and `database.yml` `test:` for future RSpec.
- **Hotwire:** Not using Turbo/Stimulus — removed `turbo-rails` / `stimulus-rails`, `yarn remove @hotwired/turbo-rails @hotwired/stimulus`, dropped imports from `application.tsx`, deleted `app/javascript/controllers/*`, removed `data-turbo-track` from the layout; `bundle install` / `yarn build`.

## Iteration 4 — Domain schema and seeds

- **Tables:** `users` (name, point_balance + timestamps), `rewards` (name, description, stock, point_cost, active + timestamps), `redemptions` (user_id, reward_id, points_spent + timestamps, FKs to users/rewards). Migrations add null constraints and sensible defaults where needed.
- **Models:** `User` / `Reward` `has_many :redemptions, dependent: :destroy`; `Redemption` `belongs_to` user and reward.
- **Commands:** `bin/rails generate model User ...`, `Reward ...`, `Redemption ...`; `bin/rails db:migrate`; `bin/rails db:seed`.
- **Seeds:** `db/seeds.rb` clears redemptions → users → rewards, then **6** users (balances spread **0–1500**) and **8** rewards (costs spread **0–1500**, mixed stock/active).
- **Indexes (SQLite):** implicit PK on `id` per table; explicit `index_redemptions_on_user_id` and `index_redemptions_on_reward_id` from `t.references` defaults.
