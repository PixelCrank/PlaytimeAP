# Playtime — Tri-World Interface (Starter)

A minimal React + Vite + TypeScript starter for the **Tri-World Interface + Emotional Compass**.

## Quick start

```bash
npm install
npm run dev
```

This boots a basic force layout and the realm switcher.

## Use your real data

1. Copy your cleaned file `Playtime_Master.csv` into the project root.
2. Generate `src/data/works.json`:

```bash
npm run csv:build
```

3. Restart the dev server if needed, then open the app.

## Where to edit

- `src/components/WorldCanvas.tsx` — main D3 force layout
- `src/components/EmotionalCompass.tsx` — realm selector
- `src/store/useStore.ts` — state for filters/realm/pins
- `src/lib/realm.ts` — realm logic and layout centers
- `src/data/works.json` — your content (generated)

## Next steps

- Add FiltersPanel (type, year, categories, emotions)
- Add Node Drawer on click (details & links)
- Add Journey view and export

## Styling

Tailwind is pre-configured. Customize in `tailwind.config.js`.
