# POOPULATION TACTICS — Title Design System

## Product and target

POOPULATION TACTICS is a deterministic pixel-art tactical RPG about gorillas, fruit, poop, forest growth, fire, and generational survival. The requested target is the opening screen inside the existing battlefield frame.

## Direction

Create an original late-1990s tactical-RPG prologue mood without copying any protected game logo, characters, interface, map, text, or melody. The feeling is solemn military chronicle colliding with absurd gorilla ecology.

- Present the game as an old forest war chronicle: chapter heading, restrained heraldry, topographic battle-map backdrop, parchment/ink framing.
- Keep POOPULATION legible as the primary identity and TACTICS as a formal subtitle.
- Preserve humor through the copy, not through goofy modern UI.
- Show a few tiny original pixel gorilla silhouettes on an isometric battlefield, using the existing canvas/sprite language rather than external imagery.

## Visual tokens

- Use only the existing palette: `#14100b`, `#1f1811`, `#2b2117`, `#4a3823`, `#f2e6cf`, `#a49070`, `#e8b23c`, `#7fae2f`, `#c9452e`, `#68d0e0`.
- Use only DotGothic16, Silkscreen, and the existing Japanese system fallbacks.
- Square two-pixel borders; no rounded cards, gradients, glossy effects, or modern glassmorphism.
- Layer dark sepia battlefield, faint contour/grid lines, parchment panel, gold rules, and subtle drifting ash/leaves.
- Hierarchy: small `FOREST CHRONICLE` eyebrow → large POOPULATION → tracked TACTICS → chapter copy → start action.

## Layout

- Full overlay remains inside the 336×292 logical battlefield frame and scales responsively.
- Use a cinematic two-zone composition: battlefield/map atmosphere behind; narrow central or lower parchment command panel in front.
- Replace the current three equal rules cards with one short mission doctrine block; detailed rules can remain accessible after start.
- Primary button copy: `音楽とともにはじめる` with a smaller secondary `音なしではじめる` action.
- Show `第I章　芽吹きの森` and a compact premise: `糞は土となり、森は兵を生む。`

## Motion and music specification

- On title: slow 8–12 second pan/parallax over the existing map canvas, faint gold scan line, sparse leaves/embers; respect reduced motion.
- On start: brief dark fade and chapter title reveal before battle.
- Theme music must be an original Web Audio composition, not an imitation of any existing melody: 6/8 or stately 3/4, around 82 BPM, minor/modal harmony, low drone, horn-like square lead, plucked arpeggio, soft marching pulse. Loop after 16 bars.
- Audio begins only after an explicit user gesture. The music-enabled start button starts it; the silent start does not.
- Existing sound toggle controls both music and SFX. Music should sit quietly beneath SFX and stop on game over or when sound is disabled.

## Accessibility

- Maintain high contrast and visible keyboard focus.
- Both start actions are real buttons.
- Do not rely on animation or sound to communicate game rules.
- Reduced-motion users receive a static composition and simple fade.
