// ====== WEAPON LISTS ======
// Every weapon in Rivals. Each one has a name and a type:
//   "standard"    — basic weapons everyone has
//   "prime"       — premium weapons
//   "contraband"  — rare/limited weapons
//
// To add a new weapon: copy a line, change the name and type, and save.
// The page rebuilds the checkbox list automatically.

const primaryWeapons = [
  { name: "Assault Rifle",    type: "standard" },
  { name: "Bow",              type: "standard" },
  { name: "Burst Rifle",      type: "standard" },
  { name: "Crossbow",         type: "standard" },
  { name: "Gunblade",         type: "standard" },
  { name: "RPG",              type: "standard" },
  { name: "Shotgun",          type: "standard" },
  { name: "Sniper",           type: "standard" },
  { name: "Energy Rifle",     type: "prime" },
  { name: "Flamethrower",     type: "prime" },
  { name: "Grenade Launcher", type: "prime" },
  { name: "Minigun",          type: "prime" },
  { name: "Paintball Gun",    type: "prime" },
  { name: "Distortion",       type: "contraband" },
  { name: "Permafrost",       type: "contraband" },
  { name: "Scepter",          type: "contraband" },
];

const secondaryWeapons = [
  { name: "Daggers",        type: "standard" },
  { name: "Flare Gun",      type: "standard" },
  { name: "Handgun",        type: "standard" },
  { name: "Revolver",       type: "standard" },
  { name: "Shorty",         type: "standard" },
  { name: "Spray",          type: "standard" },
  { name: "Uzi",            type: "standard" },
  { name: "Energy Pistols", type: "prime" },
  { name: "Exogun",         type: "prime" },
  { name: "Slingshot",      type: "prime" },
  { name: "Glass Cannon",   type: "contraband" },
  { name: "Warper",         type: "contraband" },
];

const utilityItems = [
  { name: "Flashbang",        type: "standard" },
  { name: "Freeze Ray",       type: "standard" },
  { name: "Grenade",          type: "standard" },
  { name: "Jump Pad",         type: "standard" },
  { name: "Molotov",          type: "standard" },
  { name: "Satchel",          type: "standard" },
  { name: "Smoke Grenade",    type: "standard" },
  { name: "War Horn",         type: "standard" },
  { name: "Medkit",           type: "prime" },
  { name: "Subspace Tripmine", type: "prime" },
  { name: "Warpstone",        type: "prime" },
  { name: "Elixir",           type: "contraband" },
  { name: "Grappler",         type: "contraband" },
  { name: "RNG Dice",         type: "contraband" },
];

const meleeWeapons = [
  { name: "Battle Axe",  type: "standard" },
  { name: "Chainsaw",    type: "standard" },
  { name: "Fists",       type: "standard" },
  { name: "Katana",      type: "standard" },
  { name: "Knife",       type: "standard" },
  { name: "Riot Shield", type: "standard" },
  { name: "Scythe",      type: "standard" },
  { name: "Maul",        type: "prime" },
  { name: "Spear",       type: "prime" },
  { name: "Trowel",      type: "prime" },
  { name: "Glast Shard", type: "contraband" },
];

// ====== HOW IT WORKS ======

// Keeps track of which mode we're in: "1p" or "2p".
let currentMode = "1p";

// Categories — used to build the checkbox UI and look up the right list.
const categories = [
  { id: "primary",   label: "Primary",   weapons: primaryWeapons },
  { id: "secondary", label: "Secondary", weapons: secondaryWeapons },
  { id: "utility",   label: "Utility",   weapons: utilityItems },
  { id: "melee",     label: "Melee",     weapons: meleeWeapons },
];

// pickRandom takes a list and returns one random item from it.
function pickRandom(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// Look at the checkboxes for a category and return only the weapon names
// that are currently checked.
function getEnabledWeapons(categoryId) {
  const checkboxes = document.querySelectorAll(
    `.weapon-checkbox[data-category="${categoryId}"]:checked`
  );
  return Array.from(checkboxes).map(function (cb) { return cb.value; });
}

// ====== ANIMATION SETTINGS ======
// Tweak these to make the rolling animation faster, slower, or more dramatic.
const ROLL_TICK_MS = 55;         // how often the name changes during a roll
const ROLL_FIRST_STOP_MS = 600;  // when the first slot lands
const ROLL_STAGGER_MS = 250;     // gap between each slot landing

// Locks the button while a roll is in progress so clicking again doesn't
// start a second animation on top of the first.
let isRolling = false;

// rollSlot animates a single slot: it cycles through random names from the
// pool, then locks in the final pick when the timer reaches stopAt.
function rollSlot(slotElement, pool, finalPick, stopAt) {
  // If the pool is empty we can't cycle — just show the placeholder text.
  if (pool.length === 0) {
    slotElement.textContent = finalPick;
    return;
  }

  slotElement.classList.add("rolling");
  const startTime = performance.now();

  function tick() {
    const elapsed = performance.now() - startTime;
    if (elapsed >= stopAt) {
      slotElement.textContent = finalPick;
      slotElement.classList.remove("rolling");
      slotElement.classList.add("landed");
      setTimeout(function () {
        slotElement.classList.remove("landed");
      }, 400);
      return;
    }
    slotElement.textContent = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(tick, ROLL_TICK_MS);
  }

  tick();
}

// randomize fills the slots with a fresh pick, with a rolling animation.
// Final picks are decided up front; the animation just reveals them.
// Player 1 always gets a pick. Player 2 only gets one in 2-player mode.
function randomize() {
  if (isRolling) return;

  // Plan every slot we need to roll, with its category and when it lands.
  const rolls = [
    { id: "pick-p1-primary",   category: "primary",   stopAt: ROLL_FIRST_STOP_MS + 0 * ROLL_STAGGER_MS },
    { id: "pick-p1-secondary", category: "secondary", stopAt: ROLL_FIRST_STOP_MS + 1 * ROLL_STAGGER_MS },
    { id: "pick-p1-utility",   category: "utility",   stopAt: ROLL_FIRST_STOP_MS + 2 * ROLL_STAGGER_MS },
    { id: "pick-p1-melee",     category: "melee",     stopAt: ROLL_FIRST_STOP_MS + 3 * ROLL_STAGGER_MS },
  ];

  if (currentMode === "2p") {
    rolls.push(
      { id: "pick-p2-primary",   category: "primary",   stopAt: ROLL_FIRST_STOP_MS + 0 * ROLL_STAGGER_MS },
      { id: "pick-p2-secondary", category: "secondary", stopAt: ROLL_FIRST_STOP_MS + 1 * ROLL_STAGGER_MS },
      { id: "pick-p2-utility",   category: "utility",   stopAt: ROLL_FIRST_STOP_MS + 2 * ROLL_STAGGER_MS },
      { id: "pick-p2-melee",     category: "melee",     stopAt: ROLL_FIRST_STOP_MS + 3 * ROLL_STAGGER_MS },
    );
  }

  isRolling = true;
  const button = document.getElementById("randomize");
  button.disabled = true;

  let longestStop = 0;
  for (const roll of rolls) {
    const pool = getEnabledWeapons(roll.category);
    const finalPick = pool.length === 0 ? "(none selected)" : pickRandom(pool);
    rollSlot(document.getElementById(roll.id), pool, finalPick, roll.stopAt);
    if (roll.stopAt > longestStop) longestStop = roll.stopAt;
  }

  // Re-enable the button shortly after the last slot lands.
  setTimeout(function () {
    isRolling = false;
    button.disabled = false;
  }, longestStop + 200);
}

// setMode switches between 1-player and 2-player layouts.
function setMode(mode) {
  currentMode = mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll(".mode-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
}

// Build the checkbox list for the weapon pool, one row per weapon.
// Runs once when the page loads.
function buildWeaponPool() {
  for (const cat of categories) {
    const container = document.querySelector(
      `.pool-column[data-category="${cat.id}"] .pool-list`
    );
    container.innerHTML = "";

    for (const weapon of cat.weapons) {
      const row = document.createElement("label");
      row.className = "weapon-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "weapon-checkbox";
      checkbox.dataset.category = cat.id;
      checkbox.value = weapon.name;
      checkbox.checked = true;

      const name = document.createElement("span");
      name.className = "weapon-name";
      name.textContent = weapon.name;

      const typeTag = document.createElement("span");
      typeTag.className = "weapon-type type-" + weapon.type;
      typeTag.textContent = weapon.type;

      row.appendChild(checkbox);
      row.appendChild(name);
      row.appendChild(typeTag);
      container.appendChild(row);
    }
  }
}

// Hook up the buttons.
document.getElementById("randomize").addEventListener("click", randomize);
document.querySelectorAll(".mode-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    setMode(btn.dataset.mode);
  });
});

// Build the weapon pool checkboxes when the page first loads.
buildWeaponPool();
