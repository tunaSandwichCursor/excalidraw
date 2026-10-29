## Cursor Cloud specific instructions

- The dev server listens on [http://localhost:3001](http://localhost:3001) (`VITE_APP_PORT` in `.env.development`). The environment `start` script launches `yarn --cwd excalidraw-app vite --host 0.0.0.0 --port 3001 --strictPort`, and skips launch when that URL already responds. Do not start a second copy.
- To demo UI work, open [http://localhost:3001](http://localhost:3001) in the VM browser and interact via mouse/keyboard. Collaboration (`VITE_APP_WS_SERVER_URL` on port 3002) is a separate service and is not required to draw locally.
- `yarn test:update` is known to be flaky in unrelated suites — don't block on it.
