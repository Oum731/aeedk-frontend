# Echoes of the Grid — CrazyGames submission sheet

**Upload:** `echoes-of-the-grid-crazygames.zip` (HTML5 game, `index.html` at the zip root, ~20 KB, no external assets except the CrazyGames SDK).

## Covers (CrazyGames developer portal)
- `cover-landscape-1920x1080.png` — 16:9
- `cover-portrait-800x1200.png` — 2:3
- `cover-square-800x800.png` — 1:1
(Check the exact sizes requested on the upload form: they may change.)

## Video and screenshots
- `gameplay-trailer.mp4` (1280x720, ~91 s, also as `.webm`): bot-played footage of levels 1, 8 and 14
- `screenshot-1.png`, `screenshot-2.png`, `screenshot-3.png`: gameplay screenshots (1280x720)

## Title / descriptions
- **Title:** Echoes of the Grid
- **Short description:** Team up with your own past in this neon time-loop puzzle: every loop leaves a clone that replays your moves.
- **Description (EN):** Infiltrate the grid by cooperating with yourself! Each time your timed loop ends, your last run becomes a clone that replays your moves. Use your clones to hold pressure plates, open laser doors and slip past sentries — but if a clone dies, everything it was holding open closes again. 20 levels with a smooth difficulty curve (1 to 5 stars, shorter loops as you progress), from a gentle tutorial to the six-clone Singularity finale.
- **Instructions:** WASD / ZQSD / Arrow keys: move · SPACE: end the loop · R: restart · P: pause · M: mute. On mobile: left pad to move, LOOP button to end the loop.
- **Tags:** puzzle, time loop, neon, cyberpunk, clones, logic, 1 player, mobile
- **Languages:** English, French (auto-detected from the browser, switchable in the menu)
- **Controls:** keyboard + touch
- **Orientation:** landscape (4:3 canvas scaled to fit)

## SDK integration (already done)
`init`, `loadingStart/Stop`, `gameplayStart/Stop` (on play / menus / pause / ads), `happytime` on level complete, midgame ad between levels, progress saved with `data.setItem`.
Audio is muted automatically during ads and when the game is paused by tab switch (game auto-pauses).

## Before submitting
1. Test in the CrazyGames "Basic Launch" / QA tool (`?useLocalSdk=true` etc.) from the developer portal.
2. Rebuild the zip after any change: `cd echoes-of-the-grid && python3 tools/build_zip.py`.
