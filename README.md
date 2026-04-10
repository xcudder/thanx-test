# Thanx

Rails API + React (TypeScript) Reward Hub UI, SQLite in development.

## Prerequisites

- **Ruby** 3.4.3 (see `.ruby-version`)
- **Bundler**
- **Node.js** and **Yarn** (Classic v1 is fine)
- **SQLite 3** (for the `sqlite3` gem)

No Docker is required.

## First-time setup

```bash
bundle install
yarn install
bin/rails db:setup
```

`db:setup` creates the database, loads the schema, and runs seeds. Use `bin/rails db:prepare` instead if you already have a database and only need migrations + seed.

## Run the application locally

There is no separate frontend dev server. esbuild writes JavaScript into `app/assets/builds/`, and Rails serves it with the HTML shell.

**Terminal 1 — rebuild JS when files change:**

```bash
yarn build --watch
```

**Terminal 2 — web server:**

```bash
bin/rails server
```

Open [http://localhost:3000](http://localhost:3000).

For a one-off build (no watch), run `yarn build` once before or after starting Rails.

### Optional: one process

If you have Foreman installed (`gem install foreman`):

```bash
bin/dev
```

That runs the same Rails server plus `yarn build --watch` together (see `Procfile.dev`).

## Useful commands

| Command | Purpose |
|--------|---------|
| `yarn typecheck` | TypeScript check only |
| `yarn build` | Single production-style JS bundle |
| `bundle exec rspec` | Run the request specs (if configured) |
