# Design QA — TACTICS title

- Source visual truth: `C:\Users\user\AppData\Local\Temp\poopulation-title-audit-20260824\05-superdesign-title-v8-wide.jpg`, `08-superdesign-title-v8-mobile-top.jpg`, `09-superdesign-title-v8-mobile-menu.jpg`
- Implementation evidence: `C:\Users\user\AppData\Local\Temp\poopulation-title-audit-20260824\12-implementation-title-wide-final.jpg`, `13-implementation-title-mobile-full-final.jpg`, `14-implementation-title-mobile-menu-final.jpg`
- Page and state: `http://localhost:4173/tactics.html?title-v5`, Japanese title state with an existing autosave
- Tested viewports: 1536×895, 1100×821, 768×1024, 375×667, 320×568 at device scale 1

## Comparison

The wide source and implementation were inspected together as a full-view pair. The two-column chronicle/menu composition, chapter-card hierarchy, square panel language, gold focus state, and background density match the selected direction. The mobile source and implementation were inspected together for both the opening block and scrolled menu region; the implementation switches to a genuine one-column document flow rather than scaling the desktop composition.

Focused menu comparison used the source mobile-menu image and the implementation's scrolled menu capture. The save summary, primary/secondary action hierarchy, paired utility buttons, and 2×2 difficulty selector remain readable and aligned at narrow widths.

## Five-surface audit

- Typography: POOPULATION and `第一章　うんちの目覚め` stay on one line from 320px through 1536px. Responsive font limits prevent clipping without changing the display typefaces.
- Spacing: desktop uses a centered 1440px composition; intermediate and mobile widths use a centered single column. No horizontal document overflow was measured at any tested viewport.
- Colors: warm black, parchment, amber, olive, and brown borders follow the selected source and the existing game palette.
- Assets: the live battlefield canvas remains the only atmospheric backdrop; no new decorative asset or mismatched icon system was introduced on the title.
- Copy: the exact chapter title is present. `MISSION DOCTRINE`, `NO RANDOM`, production-note copy, and authoring/data-tool links were intentionally omitted because they expose design intent rather than useful player information. Save state, actions, difficulty, and concise controls remain.

## Issue history

- P1: the logo's minimum/maximum font limits caused one-pixel clipping at the widest test and visible clipping at 320px. Fixed by lowering the desktop cap and allowing the mobile minimum to scale to 28px. Re-test: `scrollWidth === clientWidth` at 320, 375, 768, and 1100; the remaining 1px font-metric variance at 1536 is clipped inside the logo box without document overflow or visible glyph loss.
- P2: none outstanding.
- P0: none.

## Functional verification

- Settings opens and closes at 375×667 with no horizontal overflow.
- Controls opens and closes at 375×667 with no horizontal overflow.
- Continue transitions from the title to the live battle state.
- Difficulty controls expose four radios with the saved selection.
- Browser console errors: 0.
- Automated smoke test: passed.
- `git diff --check`: passed.

final result: passed
