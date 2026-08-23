# Theme

## Compact token summary

- Framework: none; inline vanilla CSS and Canvas 2D.
- Palette: soil `#14100b`, deep panel `#1f1811`, raised panel `#2b2117`, border `#4a3823`, parchment ink `#f2e6cf`, muted tan `#a49070`, gold `#e8b23c`, forest `#7fae2f`, danger `#c9452e`, sky/mana `#68d0e0`.
- Fonts: Japanese UI `DotGothic16`; pixel labels/logo `Silkscreen`; system Japanese fallbacks.
- Geometry: square two-pixel borders, no rounded corners, compact 3–14px spacing, pixel-art rendering.
- Motion: Canvas particle effects, screen shake, short synth SFX. Reduced-motion media query disables CSS animation.
- Responsive: unit card moves inside the battlefield under 720px; action spacing and title sizes compress under 560px.

## Raw source tokens and title primitives

```css
:root{
  --soil:#14100b; --soil-2:#1f1811; --soil-3:#2b2117; --line:#4a3823;
  --ink:#f2e6cf; --dim:#a49070; --gold:#e8b23c; --rot:#7fae2f; --blood:#c9452e;
  --sky:#68d0e0;
  --jp:"DotGothic16","Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;
  --px:"Silkscreen","Courier New",monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;min-height:100dvh}
body{background:var(--soil);color:var(--ink);font-family:var(--jp);display:flex;align-items:center;justify-content:center;overflow:hidden}
#cab{display:flex;flex-direction:column;width:100%;height:100dvh;max-width:1180px;padding:6px;gap:5px}
#stage{flex:1 1 auto;position:relative;display:flex;align-items:center;justify-content:center;min-height:0}
#frame{position:relative;line-height:0}
.screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#0b0805f5;text-align:center;padding:14px;z-index:6;overflow:auto;line-height:normal}
.screen[hidden]{display:none}
.logo{font-family:var(--px);font-weight:700;font-size:clamp(20px,5vw,40px);letter-spacing:.05em;color:var(--gold);text-shadow:3px 3px 0 #6b3f14,6px 6px 0 #00000080;line-height:1.05}
.tag{font-family:var(--px);font-size:11px;letter-spacing:.22em;color:var(--dim)}
.sub{font-size:12px;line-height:1.8;max-width:44ch;text-wrap:balance}
.sub em{font-style:normal;color:var(--gold)}
.rules{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:46ch}
.rule{width:104px;border:2px solid var(--line);background:var(--soil-2);padding:7px 5px;font-size:9px;line-height:1.55}
.rule canvas{width:34px;height:34px;margin:0 auto 3px;display:block;image-rendering:pixelated}
.rule b{display:block;font-size:11px;color:var(--gold);font-weight:400;margin-bottom:2px}
.start{font-family:var(--px);font-size:15px;font-weight:700;letter-spacing:.08em;background:var(--gold);color:#22160a;border:0;padding:9px 24px;cursor:pointer;box-shadow:4px 4px 0 #6b3f14}
.start:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #6b3f14}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
```
