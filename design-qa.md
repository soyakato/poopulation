**Comparison Target**
- Source visual truth: `C:\Users\user\Desktop\poopulation\.superdesign\reference-opening-v6.jpg` and `C:\Users\user\Desktop\poopulation\.superdesign\reference-battle-v6.jpg` (Superdesign draft v6).
- Implementation: `C:\Users\user\Desktop\poopulation\.superdesign\implementation-opening.jpg`, `C:\Users\user\Desktop\poopulation\.superdesign\implementation-battle.jpg`, and `C:\Users\user\Desktop\poopulation\.superdesign\implementation-steam-1280.jpg`.
- State: Japanese opening; Japanese stage 1 battle with the current gorilla in movement selection.
- Viewport/density: source and comparison implementation are both 948 × 705 CSS px and 948 × 705 image px at 1× density. Steam readability was additionally checked at 1280 × 720 CSS/image px at 1× density with no document overflow.

**Full-view Comparison Evidence**
- `C:\Users\user\Desktop\poopulation\.superdesign\comparison-opening.jpg`
- `C:\Users\user\Desktop\poopulation\.superdesign\comparison-battle.jpg`
- The opening preserves the centered chronicle composition, palette, title treatment, chapter card, two-button hierarchy, dim live battlefield, scan line, and drifting particles.
- The battle preserves the top rail, framed battlefield, right tactical rail, bottom command bar, square borders, dark soil palette, and gold/green/red/cyan semantics. Production canvas content intentionally remains the real game rather than the static Superdesign battlefield mock.

**Focused Region Comparison Evidence**
- `C:\Users\user\Desktop\poopulation\.superdesign\comparison-title-focus.jpg`: title typography, chapter card, hint, and buttons.
- `C:\Users\user\Desktop\poopulation\.superdesign\comparison-sidebar-focus.jpg`: active-unit card, growth/birth data, tactical information hierarchy, log, and camp summary.

**Findings**
- No actionable P0/P1/P2 mismatch remains.
- Fonts and typography: Silkscreen and DotGothic16 match the source. Steam-facing status, command, tile, log, and detail text was raised to 10–14 px; the blurred canvas label was removed in favor of a crisp DOM battlefield tag.
- Spacing and layout rhythm: shell proportions, 2 px borders, 5 px gaps, compact panels, and command rail match the source. The tile-detail box was moved into the right rail so it cannot cover the map.
- Colors and visual tokens: soil, ink, line, gold, rot, blood, and sky tokens match the source values.
- Image quality and asset fidelity: the code-native pixel canvas and existing sprites are preserved without replacement assets or scaling blur introduced by the shell.
- Copy and content: the requested chapter/hint copy is retained. The soundtrack meta line and deterministic forecast panel are intentionally absent per product direction. JP/EN switching covers opening, HUD, commands, unit details, birth forecast, tile details, and primary logs.

**Open Questions**
- None blocking. Gorilla proper names remain Japanese in English mode by design.

**Comparison History**
- Iteration 1 — P1: the old GitHub layout used an overlay log/card and did not match the Superdesign battle shell. Fix: rebuilt it as top rail + battlefield + right rail + command footer. Evidence: `comparison-battle.jpg`.
- Iteration 2 — P2: soundtrack meta copy and deterministic forecast remained after product direction changed. Fix: removed both and expanded useful growth/log space. Evidence: `comparison-opening.jpg` and `comparison-sidebar-focus.jpg`.
- Iteration 3 — P1: active-turn canvas text was visibly soft and the first tile-detail overlay covered the lower-left battlefield. Fix: moved active state to the crisp DOM tag and tile details into the right rail. Evidence: `implementation-steam-1280.jpg`.
- Iteration 4 — P1: several labels were undersized for a Steam 1280 × 720 target. Fix: raised key UI text sizes, widened the tactical rail, and rechecked 1280 × 720 with zero page overflow. Evidence: `implementation-steam-1280.jpg`.

**Primary Interactions Tested**
- Start silently, JP/EN switch during battle, arrow-key tile selection, Enter movement confirmation, tile-detail updates, and two-step current-stage restart.
- Automated smoke suite: passed.
- Browser console: no implementation error observed during the tested flow.

**Implementation Checklist**
- [x] Superdesign opening and shell reproduced.
- [x] Dynamic opening background matched.
- [x] JP/EN language switch added and persisted.
- [x] Arrow-key movement and compact tile information added.
- [x] Gold poop consumes yellow, red, and blue fruit.
- [x] Belly limited to three fruit slots.
- [x] Restart preserves run unlocks and restarts only the current stage.
- [x] Steam 1280 × 720 readability and overflow checked.

**Follow-up Polish**
- P3: localize gorilla proper names only if the narrative later defines official romanizations.

final result: passed
