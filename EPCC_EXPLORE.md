# Exploration: 2048 React Game

**Date**: 2026-04-16 | **Scope**: Medium | **Status**: ✅ Complete

## 1. Foundation (What exists)

**Tech stack**: React 19 + TypeScript 6 (strict), Vite 8, Jest 30 + ts-jest, ESLint 9
**Architecture**: Single-page React app, no routing, no state management library
**Structure**:
- `src/main.tsx` — entry point, renders `<App />`
- `src/App.tsx` — root component; keyboard + touch input, layout
- `src/components/` — Board, Tile, Score, GameOverlay
- `src/hooks/useGame.ts` — game state hook (localStorage for bestScore)
- `src/utils/gameLogic.ts` — pure functions: initGame, moveBoard, canMove, createTile
- `src/types/game.ts` — shared types: Tile, GameState, Direction
- `src/utils/gameLogic.test.ts` — Jest unit tests (only util layer covered)

**CLAUDE.md instructions**:
- TypeScript strict mode, Airbnb style + Prettier
- Destructured imports, arrow function components
- ALWAYS include error handling in async functions
- Typecheck after changes (`npm run typecheck`)
- Write unit tests for new components and utilities
- Dev server on port 3000, allow `*.cloudfront.net`

## 2. Patterns (How it's built)

**Architectural patterns**:
- **Pure game logic** (`gameLogic.ts`): All state transitions are pure functions returning new state — easy to test, no side effects
- **Custom hook** (`useGame.ts`): Wraps game state + localStorage persistence; exposes `{ gameState, move, newGame, continueGame }`
- **Presentational components**: Board, Tile, Score, GameOverlay are props-only display components with no internal state
- **CSS-in-class**: All styling via `App.css` with BEM-like class names; tile colors via inline style map in `Tile.tsx`

**Tile ID system**: Global `idCounter` module-level var + per-call `counter` ref passed explicitly — tests use the `counter` pattern to get deterministic IDs

**Tile positioning**: Absolute positioning via CSS `transform: translate(x, y)` calculated from `(col * (cellSize + gap), row * (cellSize + gap))`; animations via `.tile-new` / `.tile-merged` CSS keyframes

**Testing patterns**:
- Framework: Jest + ts-jest, `testEnvironment: 'node'`
- Pattern: `makeTile` helper defined inline per describe block
- Coverage: Only `gameLogic.ts` tested; components have no tests yet
- CSS imports mocked via `__mocks__/fileMock.js`

**Error handling**: localStorage wrapped in try/catch (only async-adjacent I/O present)

## 3. Constraints (What limits decisions)

**Technical**:
- Grid size hardcoded as `GRID_SIZE = 4` constant in both `gameLogic.ts` and `Board.tsx`
- Cell size/gap constants in `Board.tsx` (`CELL_SIZE = 100`, `GAP = 12`); responsive breakpoint at 520px drops to 72px via CSS only — Board.tsx still passes 100px
- Tile animation uses CSS custom properties `--tx`/`--ty` referenced in keyframes but never set — animations may not translate correctly during appear/pop

**Quality**:
- `npm run typecheck` required after changes
- Unit tests required for new components and utilities
- Strict TypeScript (`tsconfig.app.json` references strict)

**Operational**: Vite dev server port 3000, `allowedHosts: ['.cloudfront.net']`

## 4. Reusability (What to leverage)

**`makeTile` helper pattern** (test files): Inline factory returning full `Tile` shape — reuse this in any new test files
**`createTile(value, row, col, counter)`**: Public exported function usable in tests and game logic
**`useGame` hook**: Complete game state interface; new UI features should consume this hook rather than managing state independently
**GameOverlay**: Accepts `onContinue?: () => void` — optional prop pattern; follow for optional callbacks

## 5. Handoff (What's next)

**For PLAN**: 
- Board sizing inconsistency between CSS responsive styles and Board.tsx hardcoded values is a known gap
- No component tests exist — any new component work must add them per CLAUDE.md
- Animation CSS vars `--tx`/`--ty` are declared in keyframes but never set on elements

**For CODE**: 
- Test runner: `npm run test` (Jest, node env)
- Type checker: `npm run typecheck`
- Linter: `npm run lint`
- Dev server: `npm run dev` (port 3000)

**For COMMIT**: Pass typecheck + lint + relevant Jest tests

**Gaps**:
- No component-level tests (Score, Board, Tile, GameOverlay, App) — CLAUDE.md requires these for new work
- Responsive tile sizing: CSS media query resizes cells to 72px but Board component passes `cellSize={100}` hardcoded — tiles overflow on mobile
