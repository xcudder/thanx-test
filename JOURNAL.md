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

## Iteration 5 — REST API, redemption flow, and layering

- **HTTP API:** `GET /users/:id/balance`, `GET /rewards` (in-stock + active), `POST /redeem` (JSON `user_id`, `reward_id`), `GET /users/:id/redemption_history`. `Api::BaseController` + JSON `404` for `RecordNotFound`.
- **Specs (this batch):** Wired **RSpec** — `rspec-rails` in the Gemfile, `config.generators { |g| g.test_framework :rspec }`, `spec/rails_helper.rb` / `spec_helper.rb`. Added **`spec/requests/thanx_api_spec.rb`** (request-type) covering all four endpoints: balance + 404; rewards filter + payload fields; redeem success, `422` + no partial writes for insufficient points / zero stock / inactive reward, `404` for unknown user or reward, and only one successful redeem when a single unit remains; redemption history ordering, empty list, and 404 for missing user. Run with `bundle exec rspec spec/requests/thanx_api_spec.rb`.
- **Redeem semantics:** Single DB transaction; debit user, decrement reward stock, create `Redemption` together. Pessimistic `User.lock` / `Reward.lock` so concurrent redeems cannot double-spend balance or the last unit of stock.
- **`RedemptionService`:** Class method `redeem_reward(user, reward)` — takes **already locked** AR instances; validates (`Unredeemable` + `error_code`) then persists; returns `RedemptionService::Result`. Nested types live under `app/services/redemption_service/` (`unredeemable.rb`, `result.rb`) to avoid a bloated main file.
- **Controller split:** `Api::RedemptionsController` uses **`around_action`** so **`ActiveRecord::Base.transaction`** wraps **`before_action`** `set_user` / `set_reward` (`User.lock.find` / `Reward.lock.find` via strong params) **and** `redeem`. That way row locks are still held for the whole redeem (locks are not “before the transaction” in a separate auto-commit scope).
- **Response shape:** `RedeemRedemptionSerializer`; `config.autoload_paths << app/serializers` for Zeitwerk.
- **Design thread (conversation):** Explored service object vs fat controller — correctness hinges on **transaction + lock scope**, not on whether a `Service` class exists. Discussed `lock` vs transaction (different concepts; multi-step redeem needs both in one transaction). Naming moved from generic `call` to `redeem_reward`; `code` → `error_code` on `Unredeemable`. Removed the old `app/services/redemptions/redeem_reward.rb` in favor of `RedemptionService`.

## Iteration 6 — Reward Hub UI: native controls and lean JS deps

- **Goal:** Keep Thanx / `rh-*` branding and layout tokens, but drop Radix / Lovable-style polish in favor of padded native `<select>`, simple modal markup, tab buttons (state toggles panels), and unicode or text where icons were.
- **App shell:** `App.tsx` trimmed to `BrowserRouter` + routes only (no React Query / tooltip / toaster wrappers).
- **Components:** `FlashMessage` (auto-dismiss + dismiss control) replaces toast hook; `UserSelector` uses a native select + initials badge; `RedeemDialog` is a focusable modal with backdrop + Escape; `RewardCard` / `PointsBalance` / `RedemptionHistory` use plain elements (no Framer / Lucide); `Index` drives `browse | history` with two `role="tab"` buttons.
- **Removed:** Entire `app/javascript/components/lovable-ui/`; `package.json` dependencies dropped `@radix-ui/*`, `@tanstack/react-query`, `framer-motion`, `lucide-react`; `yarn install` refreshed the lockfile.
- **Styles:** `application.css` gained blocks for `.rh-flash*`, `.rh-tab-bar` / `.rh-tab-btn*`, `.rh-native-select`, `.rh-modal*`, `.rh-btn*`, user-selector native row / initials, list resets for history `<ul>`, and small tweaks for unicode “icons” in balance / history.
- **Note:** A large legacy `.ui-*` / Radix-oriented section may still exist in CSS as dead weight — safe to delete in a later cleanup.

## Iteration 7 — Front-end types = API shapes; SPA-friendly routing

- **Goal:** Stop renaming JSON fields in the client; if naming is wrong, fix the API. Centralize TypeScript types and context contracts.
- **Types:** `app/javascript/types/reward-hub.ts` — `Reward`, `Redemption` (history row), `ApiUser`, `UserOption`, flash / dialog props, `RewardHubPanel`. Removed `lib/rewards-data.ts` and `lib/rewardHubMappers.ts`.
- **Services:** `rewardsService` / `usersService` import those types; responses use the same property names as Rails JSON (`point_cost`, `photo`, `reward_name`, `points_spent`, `created_at`, etc.).
- **Fallback image:** `REWARD_IMAGE_FALLBACK` lives next to its use in `RewardCard` (`photo ?? fallback`).
- **Context typing:** `types/reward-hub-context.ts` holds `RewardHubContextValue` (and later redeem-hook params/return).
- **Rails routes:** Catch-all `GET *path` → `home#index` **after** explicit API routes, with `constraints` excluding `/rails/`, `/assets/`, `/packs/` so the SPA shell loads for unknown client paths while assets and engines still work. Full reloads on `/foo` can hit React `NotFound` instead of only `public/404.html`.
- **`NotFound.tsx`:** Simplified (no `useLocation` / `console.error`); static pages `public/404.html`, `422.html`, `500.html` kept for real server errors.

## Iteration 8 — RewardHub context modularization and readable redeem path

- **Goal:** Keep `RewardHubContext` mostly “when to load what” (effects) and composition; push orchestration helpers and redeem logic into named modules and a dedicated hook.
- **Layout components:** `RewardHubToolbar` (title + `UserSelector`), `RewardHubTabs` (tab bar + `browsePanel` / `historyPanel` slots) slim `Index.tsx`.
- **`RewardHubProvider`:** Two `useEffect`s — **(1)** one-time bootstrap via `runInitialRewardHubBootstrap` (`lib/rewardHub/boot.ts` + `fetchRewardHubBootPayload` / `userOptionsFromApiUsers`); **(2)** wallet + history when `activeUserId` changes via `loadUserWalletFromServer` (`walletCatalog.ts`). Comments above each effect document intent so readers do not infer only from dependency arrays.
- **Flashes & errors:** `lib/rewardHub/flashPayloads.ts` (boot failure, user load failure, redeem success / 422 / generic); `lib/rewardHub/redeemApiErrors.ts` (`redeemRejectionCodeFrom422Body`, `userMessageForRedeemRejectionCode`).
- **`useRewardHubRedeem`:** Lives under `lib/rewardHub/`; **owns** `selectedReward`, `redeemSubmitting`, `handleRedeem`, `handleCancelRedeem`. Parent passes only `activeUserId`, `userOptions`, and setters for **server-backed** slices: points, history, rewards, flash (`UseRewardHubRedeemParams` / `UseRewardHubRedeemReturn` in `types/reward-hub-context.ts`).
- **Readability tweaks:** After successful POST, `loadWalletAndRewardsAfterRedeem` returns a `WalletCatalogRefreshSnapshot`; `applyWalletCatalogRefresh(snapshot, { setPoints, setHistory, setRewards })` applies it in one named step. `clearSelectedReward()` wraps `setSelectedReward(null)` for cancel + post-success cleanup.
