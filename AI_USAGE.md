## AI Assistance

Three AI tools were used across this project.

### Lovable
Generated the initial frontend prototype. I used it to start with a solid UX baseline
and then stripped it down to core essentials — removing Tailwind, Radix, Framer Motion,
and React Query — to have real ownership of the final frontend while keeping the
reasonable UX assumptions already baked in (accessible modals, keyboard handling,
toast behavior, and so on).

### Claude (claude.ai)
Used separately as an architectural sounding board. Mostly checking on my assumptions and double checking standards.
Used like a big picture tracking assistant. No code generation.

### Cursor (Composer 2)
Used as a development accelerator throughout. Cursor executed on instruction —
generating code, running specs, and applying refactors. Key iterations:

- Bootstrapped the Rails app with esbuild, React, and TypeScript configured correctly
- Generated migrations and seed data after I decided on the schema
- Built out routes and controllers after I defined the API contract
- Added request specs alongside each controller as they were built
- Through a bit of manual iteration, identified that controllers and the service were leaking
  response shaping concerns and introduced a serializer layer — manually deciding
  which endpoints warranted one and which were simple enough to leave inline, with
  a comment explaining the call
- Refactored an over-engineered service object down to the
  current `RedemptionService.redeem_reward` shape — pushing back on ceremonial
  abstraction and settling the naming, responsibility split, and nested file structure
- Manually worked through the concurrency failure modes the app is exposed to, then
  directed Cursor to add DB-level check constraints, pessimistic row locking, and a
  spec suite that simulates validation being bypassed to prove the DB layer holds
  independently
- Wired the stripped-down frontend to the Rails API
- Through a bit more manual iteration, restructured the React architecture across several passes —
  extracting context into named modules by responsibility, segregating types from
  implementation, and introducing explicit helpers like `clearSelectedReward` and
  `applyWalletCatalogRefresh` to make the redeem flow readable without needing a comment