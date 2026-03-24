# AccountOS — Claude Code Project Instructions

## Project Overview

AccountOS is an account intelligence and relationship management platform. Read `docs/PRD_v2.md` for full context. Read Linear issues (EPA-* in the EPAM team, AccountOS project) for task specifications.

## Repository Structure

```
accountos/
  packages/
    client/           # React 18 + TypeScript + TailwindCSS + Vite
    server/           # Node.js + Express + TypeScript
    shared/           # Shared types, Zod validation schemas
    prisma/           # Prisma ORM schema, migrations, seed
  docs/
    PRD_v2.md         # Product Requirements Document (source of truth)
  scripts/            # Dev scripts, utilities
  .agents/            # Agent instruction files (design, test, review)
  CLAUDE.md           # This file
```

## Critical Rules (Read These First)

### 1. NO EMOJIS — ANYWHERE
Do not use emoji characters, Unicode emoji, emoji-based icon libraries, or any glyph from Unicode emoji ranges anywhere in the codebase, UI, comments, commit messages, or generated content. All icons are custom SVGs. If you find yourself reaching for an emoji, stop and use an SVG icon component instead. Before completing any task, run:
```bash
grep -rP '[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F1E0}-\x{1F1FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}\x{FE00}-\x{FE0F}\x{1F900}-\x{1F9FF}\x{1FA00}-\x{1FA6F}\x{1FA70}-\x{1FAFF}\x{200D}\x{20E3}]' --include='*.ts' --include='*.tsx' --include='*.css' --include='*.html' --include='*.json' --include='*.md' packages/ || echo "CLEAN: No emojis found"
```
If any matches are found, fix them before committing.

### 2. Dark Mode Default
Dark mode is the default theme. Light mode is available via toggle. All CSS must use CSS custom properties (variables) for colors. TailwindCSS `dark:` class strategy is configured. Every new component must look correct in dark mode FIRST, then verify light mode.

### 3. 30-Second Rule
Adding a contact (Cmd+N), logging a communication (Cmd+L), and creating a meeting note (Cmd+M) must each complete in under 30 seconds. This is measured in Playwright tests.

### 4. RAG Status Accessibility
All health/status indicators use THREE redundant channels: color + shape + text label.
- Healthy: Green + Circle + "Healthy"
- Monitor: Amber + Diamond + "Monitor"  
- At Risk: Red + Triangle + "At Risk"
Never use color alone.

### 5. Progressive Disclosure on Org Chart
Compact node cards show ONLY: name, title, role badge, sentiment dot, last-contact date. All other data (desires, tech affinities, background, LinkedIn, relationship score) appears only in the slide-over panel.

## Agent Workflow

This project uses specialized agents for different concerns. Always delegate to the appropriate agent rather than mixing concerns in a single pass.

### Workflow for Each Linear Issue

1. **Read the issue** — Pull the full description from Linear (EPA-N)
2. **Plan** — Before writing any code, create a brief implementation plan as a comment on the issue. List files to create/modify, components to build, API routes needed.
3. **Delegate to Design Agent** — If the task involves any UI components, SVG icons, or visual elements, delegate to `.agents/design.md` FIRST. The design agent produces component shells, SVG icons, color tokens, and layout specifications.
4. **Delegate to Code Agent** — Implementation of business logic, API routes, database queries, state management, and wiring up designed components. Follows `.agents/code.md`.
5. **Delegate to Test Agent** — After implementation, delegate to `.agents/test.md` for unit tests, component tests, Playwright E2E tests, and visual regression. Tests must pass before the task is considered complete.
6. **Self-Review** — Run the full check: lint, typecheck, tests, emoji grep, dark/light mode screenshot comparison.

### Agent Delegation Syntax
When delegating to a sub-agent, use:
```
Read .agents/design.md for your instructions, then [specific task description]
```

## Tech Stack Quick Reference

| Layer | Package | Location |
|-------|---------|----------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite | packages/client |
| Org Chart | React Flow (@xyflow/react), @dagrejs/dagre | packages/client |
| State | Zustand (with temporal middleware for undo/redo) | packages/client |
| Icons | Custom SVG components (NO external icon libraries, NO emoji) | packages/client/src/icons |
| Backend | Express, TypeScript | packages/server |
| Database | Prisma ORM, SQLite (dev) / PostgreSQL (prod) | packages/prisma |
| Shared Types | Zod schemas, TypeScript types | packages/shared |
| Search | Fuse.js (client-side) | packages/client |
| Unit Tests | Vitest | all packages |
| Component Tests | Vitest + React Testing Library | packages/client |
| E2E Tests | Playwright | packages/client/e2e |
| API Tests | Vitest + Supertest | packages/server |

## Commands

```bash
npm run dev          # Start client (5173) + server (3001) concurrently
npm run build        # Build all packages
npm run test         # Run all unit + component tests
npm run test:e2e     # Run Playwright E2E tests
npm run lint         # ESLint across all packages
npm run typecheck    # TypeScript strict check across all packages
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed demo data
npm run db:reset     # Reset DB and re-seed
npm run icons:audit  # Grep for emoji violations
```

## Commit Convention

```
feat(EPA-N): short description
fix(EPA-N): short description  
test(EPA-N): short description
docs(EPA-N): short description
refactor(EPA-N): short description
```

Always reference the Linear issue ID. Keep commits focused — one logical change per commit.

## File Naming

- React components: PascalCase (`ContactProfile.tsx`, `OrgChartNode.tsx`)
- Hooks: camelCase with `use` prefix (`useContacts.ts`, `useOrgChart.ts`)
- API routes: kebab-case (`contact-routes.ts`, `meeting-note-routes.ts`)
- Icons: PascalCase matching the icon name (`ChampionIcon.tsx`, `PhoneCallIcon.tsx`)
- Tests: same name as source with `.test.` suffix (`ContactProfile.test.tsx`)
- E2E: descriptive kebab-case (`org-chart-navigation.spec.ts`)

## Linear Integration

Issues are in the EPAM team, AccountOS project. Issue IDs are EPA-1 through EPA-32. Each issue contains:
- Implementation instructions
- Testing requirements  
- Acceptance criteria
- Dependency chains (blockedBy)

Read the issue description before starting work. Post a brief plan as a comment before implementing.

## Phase 1 Execution Order

```
EPA-2  → Project scaffolding (do this first, it unblocks everything)
EPA-3  → Database schema + API (can start after EPA-2)
EPA-4  → SVG icon system (can start after EPA-2, uses design agent)
EPA-6  → App shell + navigation (needs EPA-2, EPA-4)
EPA-7  → Org chart (needs EPA-3, EPA-6)
EPA-8  → Contact profiles (needs EPA-3, EPA-6)
EPA-9  → Department pages (needs EPA-3, EPA-6)
EPA-10 → Communication logging (needs EPA-3, EPA-6)
EPA-11 → Meeting notes editor (needs EPA-3, EPA-6)
EPA-12 → Project management (needs EPA-3, EPA-6)
EPA-13 → Account 360 page (needs EPA-3, EPA-6)
EPA-14 → Executive dashboard (needs EPA-12, EPA-13)
EPA-15 → Seed data (needs EPA-3)
EPA-31 → Integration test suite (needs all above)
```
