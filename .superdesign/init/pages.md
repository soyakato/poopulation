# Pages

## `/tactics.html` — TACTICS

Entry: `tactics.html`

Dependencies:

- `tactics.html`
  - `poop-config.js` — shared numeric master data
  - Google Fonts stylesheet — DotGothic16 and Silkscreen

Relevant rendered target:

- `#cab` application shell
  - `#rail` persistent status/navigation
  - `#stage > #frame`
    - `canvas#cv` live deterministic battlefield backdrop
    - `#scTitle.screen` current title overlay
      - `.logo` POOPULATION
      - `.tag` TACTICS
      - `.sub` premise
      - `#ruleBox.rules` three generated sprite cards
      - `.start#bStart`
  - `#acts` persistent action bar

The title overlay is the requested redesign target. Its start handler hides the overlay and calls `newGame()`.
