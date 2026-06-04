# TVFixed

A Vite + React visualization app for algorithm and data structure demonstrations.

## Run locally

1. `npm install`
2. `npm run dev`
3. Open the local Vite URL shown in the terminal.

## Project structure

- `src/index.html` — active Vite entrypoint because `vite.config.js` uses `root: src`
- `src/entry.jsx` — React bootstrap file
- `src/App.jsx` — main application UI
- `src/App.css` — app styling

## Notes

The project is configured with `vite.config.js` to use `src` as the Vite root. That means the root-level `index.html` is not the build entry.
