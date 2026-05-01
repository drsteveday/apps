# Rivals Loadout Randomizer

A weapon picker for the game Rivals. Click a button and it picks a random Primary, Secondary, Utility, and Melee for you.

**Live:** [https://drsteveday.github.io/apps/rivals-randomizer/](https://drsteveday.github.io/apps/rivals-randomizer/)

## How to open it

Either:
- Visit the live link above from any device, or
- Double-click **`index.html`** to open it from your computer (no internet needed).

## How to use it

1. Pick **1 PLAYER** or **2 PLAYERS** at the top.
2. Click the big yellow **RANDOMIZE** button.
3. The randomizer fills in a weapon for each slot.
4. Click RANDOMIZE again any time you want a fresh loadout.

### Picking which weapons can show up

Below the button there's a **WEAPON POOL** — every weapon in the game grouped by category. Each one has a checkbox.

- **Checked** = it can be picked.
- **Unchecked** = it won't be picked.

So if you only want to play with Standard weapons, uncheck all the Prime and Contraband ones. If a category has nothing checked, that slot will say "(none selected)" when you randomize.

The little tags next to each weapon name show the type:

- **standard** (grey) — basic weapons everyone has
- **prime** (blue) — premium weapons
- **contraband** (red) — rare or limited weapons

## What's in this folder

- **`index.html`** — the page you see in the browser.
- **`style.css`** — the colours, fonts, and layout.
- **`script.js`** — the weapon lists, the pool builder, and the randomizer logic.

## How to add a new weapon

Open `script.js`. At the top you'll see four lists — one for each category. Each line looks like this:

```js
{ name: "Assault Rifle", type: "standard" },
```

To add a new Primary called "Laser Cannon" of the standard type, copy a line and change it:

```js
const primaryWeapons = [
  { name: "Assault Rifle",  type: "standard" },
  { name: "Bow",            type: "standard" },
  { name: "Laser Cannon",   type: "standard" },   // <-- new line
  ...
];
```

Save the file and refresh the page. The new weapon shows up as a checkbox in the pool, ready to be picked.

The `type` can be `"standard"`, `"prime"`, or `"contraband"`.
