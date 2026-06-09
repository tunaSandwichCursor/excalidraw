## Cursor Cloud specific instructions

### Dev server

- The Vite dev server runs on **port 3001** (set via `VITE_APP_PORT` in `.env.development`), not the default 3000.
- Start it with `yarn start` from the repo root (runs `excalidraw-app`). If a session is already serving on 3001, do not start a second instance.
- To demo UI work, open [http://localhost:3001](http://localhost:3001) in the VM browser and interact via mouse/keyboard.

### Lint / test / build

- Typecheck: `yarn test:typecheck`
- ESLint: `yarn test:code`
- Prettier check: `yarn test:other`
- Unit tests: `yarn test:app --watch=false`
- Build app: `yarn build:app`
- See root `package.json` scripts and `CLAUDE.md` for the full command list.

### Known caveats

- `yarn test:update` and many React/DOM integration tests are known to be flaky in this environment (canvas/jsdom issues) — don't block on the full suite. Pure logic tests (e.g. `packages/math`, `packages/excalidraw/charts.test.ts`) are reliable.
- Optional services (collaboration WebSocket on 3002, AI backend on 3016) are not required for basic drawing.

