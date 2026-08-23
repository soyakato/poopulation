# Layouts

There is no shared layout module. Each HTML file owns its app shell. The TACTICS shell is implemented inline in `tactics.html`:

```html
<div id="cab">
  <div id="rail">stage, round, units, turn order, mode links, sound, reset</div>
  <div id="stage"><div id="frame">
    <canvas id="cv" width="336" height="292" aria-label="戦場"></canvas>
    <div id="log"></div>
    <div id="card" hidden>selected-unit details</div>
    <div class="screen" id="scTitle">title and introduction</div>
    <div class="screen" id="scEnd" hidden>end results</div>
    <div class="screen" id="scCamp" hidden>stage rewards</div>
  </div></div>
  <div id="acts">battle actions and birth forecast</div>
</div>
```

The title target is `#scTitle`, a full overlay inside the fixed battlefield frame. It must continue to coexist with the persistent rail and action bar.
