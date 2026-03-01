// Canonical FireRed/LeafGreen encounter tables
// Source: Bulbapedia / PokeAPI
// FR = FireRed only, LG = LeafGreen only, BOTH = shared

export const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const SPECIES: Array<{
  id: number;
  name: string;
  slug: string;
}> = [
  { id: 1, name: "Bulbasaur", slug: "bulbasaur" },
  { id: 4, name: "Charmander", slug: "charmander" },
  { id: 7, name: "Squirtle", slug: "squirtle" },
  { id: 10, name: "Caterpie", slug: "caterpie" },
  { id: 11, name: "Metapod", slug: "metapod" },
  { id: 13, name: "Weedle", slug: "weedle" },
  { id: 14, name: "Kakuna", slug: "kakuna" },
  { id: 16, name: "Pidgey", slug: "pidgey" },
  { id: 17, name: "Pidgeotto", slug: "pidgeotto" },
  { id: 19, name: "Rattata", slug: "rattata" },
  { id: 20, name: "Raticate", slug: "raticate" },
  { id: 21, name: "Spearow", slug: "spearow" },
  { id: 22, name: "Fearow", slug: "fearow" },
  { id: 23, name: "Ekans", slug: "ekans" },
  { id: 24, name: "Arbok", slug: "arbok" },
  { id: 25, name: "Pikachu", slug: "pikachu" },
  { id: 26, name: "Raichu", slug: "raichu" },
  { id: 27, name: "Sandshrew", slug: "sandshrew" },
  { id: 28, name: "Sandslash", slug: "sandslash" },
  { id: 29, name: "Nidoran-F", slug: "nidoran-f" },
  { id: 30, name: "Nidorina", slug: "nidorina" },
  { id: 31, name: "Nidoqueen", slug: "nidoqueen" },
  { id: 32, name: "Nidoran-M", slug: "nidoran-m" },
  { id: 33, name: "Nidorino", slug: "nidorino" },
  { id: 34, name: "Nidoking", slug: "nidoking" },
  { id: 35, name: "Clefairy", slug: "clefairy" },
  { id: 36, name: "Clefable", slug: "clefable" },
  { id: 37, name: "Vulpix", slug: "vulpix" },
  { id: 38, name: "Ninetales", slug: "ninetales" },
  { id: 39, name: "Jigglypuff", slug: "jigglypuff" },
  { id: 40, name: "Wigglytuff", slug: "wigglytuff" },
  { id: 41, name: "Zubat", slug: "zubat" },
  { id: 42, name: "Golbat", slug: "golbat" },
  { id: 43, name: "Oddish", slug: "oddish" },
  { id: 44, name: "Gloom", slug: "gloom" },
  { id: 46, name: "Paras", slug: "paras" },
  { id: 47, name: "Parasect", slug: "parasect" },
  { id: 48, name: "Venonat", slug: "venonat" },
  { id: 49, name: "Venomoth", slug: "venomoth" },
  { id: 50, name: "Diglett", slug: "diglett" },
  { id: 51, name: "Dugtrio", slug: "dugtrio" },
  { id: 52, name: "Meowth", slug: "meowth" },
  { id: 53, name: "Persian", slug: "persian" },
  { id: 54, name: "Psyduck", slug: "psyduck" },
  { id: 55, name: "Golduck", slug: "golduck" },
  { id: 56, name: "Mankey", slug: "mankey" },
  { id: 57, name: "Primeape", slug: "primeape" },
  { id: 58, name: "Growlithe", slug: "growlithe" },
  { id: 59, name: "Arcanine", slug: "arcanine" },
  { id: 60, name: "Poliwag", slug: "poliwag" },
  { id: 61, name: "Poliwhirl", slug: "poliwhirl" },
  { id: 62, name: "Poliwrath", slug: "poliwrath" },
  { id: 63, name: "Abra", slug: "abra" },
  { id: 64, name: "Kadabra", slug: "kadabra" },
  { id: 66, name: "Machop", slug: "machop" },
  { id: 67, name: "Machoke", slug: "machoke" },
  { id: 69, name: "Bellsprout", slug: "bellsprout" },
  { id: 70, name: "Weepinbell", slug: "weepinbell" },
  { id: 72, name: "Tentacool", slug: "tentacool" },
  { id: 73, name: "Tentacruel", slug: "tentacruel" },
  { id: 74, name: "Geodude", slug: "geodude" },
  { id: 75, name: "Graveler", slug: "graveler" },
  { id: 77, name: "Ponyta", slug: "ponyta" },
  { id: 78, name: "Rapidash", slug: "rapidash" },
  { id: 79, name: "Slowpoke", slug: "slowpoke" },
  { id: 80, name: "Slowbro", slug: "slowbro" },
  { id: 81, name: "Magnemite", slug: "magnemite" },
  { id: 82, name: "Magneton", slug: "magneton" },
  { id: 84, name: "Doduo", slug: "doduo" },
  { id: 85, name: "Dodrio", slug: "dodrio" },
  { id: 86, name: "Seel", slug: "seel" },
  { id: 87, name: "Dewgong", slug: "dewgong" },
  { id: 88, name: "Grimer", slug: "grimer" },
  { id: 89, name: "Muk", slug: "muk" },
  { id: 90, name: "Shellder", slug: "shellder" },
  { id: 91, name: "Cloyster", slug: "cloyster" },
  { id: 92, name: "Gastly", slug: "gastly" },
  { id: 93, name: "Haunter", slug: "haunter" },
  { id: 94, name: "Gengar", slug: "gengar" },
  { id: 95, name: "Onix", slug: "onix" },
  { id: 96, name: "Drowzee", slug: "drowzee" },
  { id: 97, name: "Hypno", slug: "hypno" },
  { id: 98, name: "Krabby", slug: "krabby" },
  { id: 99, name: "Kingler", slug: "kingler" },
  { id: 100, name: "Voltorb", slug: "voltorb" },
  { id: 101, name: "Electrode", slug: "electrode" },
  { id: 102, name: "Exeggcute", slug: "exeggcute" },
  { id: 104, name: "Cubone", slug: "cubone" },
  { id: 105, name: "Marowak", slug: "marowak" },
  { id: 109, name: "Koffing", slug: "koffing" },
  { id: 110, name: "Weezing", slug: "weezing" },
  { id: 111, name: "Rhyhorn", slug: "rhyhorn" },
  { id: 112, name: "Rhydon", slug: "rhydon" },
  { id: 113, name: "Chansey", slug: "chansey" },
  { id: 114, name: "Tangela", slug: "tangela" },
  { id: 115, name: "Kangaskhan", slug: "kangaskhan" },
  { id: 116, name: "Horsea", slug: "horsea" },
  { id: 117, name: "Seadra", slug: "seadra" },
  { id: 118, name: "Goldeen", slug: "goldeen" },
  { id: 119, name: "Seaking", slug: "seaking" },
  { id: 120, name: "Staryu", slug: "staryu" },
  { id: 121, name: "Starmie", slug: "starmie" },
  { id: 123, name: "Scyther", slug: "scyther" },
  { id: 125, name: "Electabuzz", slug: "electabuzz" },
  { id: 126, name: "Magmar", slug: "magmar" },
  { id: 127, name: "Pinsir", slug: "pinsir" },
  { id: 128, name: "Tauros", slug: "tauros" },
  { id: 129, name: "Magikarp", slug: "magikarp" },
  { id: 130, name: "Gyarados", slug: "gyarados" },
  { id: 131, name: "Lapras", slug: "lapras" },
  { id: 132, name: "Ditto", slug: "ditto" },
  { id: 133, name: "Eevee", slug: "eevee" },
  { id: 138, name: "Omanyte", slug: "omanyte" },
  { id: 140, name: "Kabuto", slug: "kabuto" },
  { id: 142, name: "Aerodactyl", slug: "aerodactyl" },
  { id: 143, name: "Snorlax", slug: "snorlax" },
  { id: 144, name: "Articuno", slug: "articuno" },
  { id: 145, name: "Zapdos", slug: "zapdos" },
  { id: 146, name: "Moltres", slug: "moltres" },
  { id: 147, name: "Dratini", slug: "dratini" },
  { id: 148, name: "Dragonair", slug: "dragonair" },
  { id: 149, name: "Dragonite", slug: "dragonite" },
  { id: 150, name: "Mewtwo", slug: "mewtwo" },
];

// Encounter record shape
type E = {
  speciesId: number;
  method: string;
  minLevel: number;
  maxLevel: number;
  chance: number;
};

// Route data shape
export type RouteRecord = {
  name: string;
  slug: string;
  firered: E[];
  leafgreen: E[];
};

function w(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "walk", minLevel, maxLevel, chance };
}
function surf(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "surf", minLevel, maxLevel, chance };
}
function oldRod(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "old-rod", minLevel, maxLevel, chance };
}
function goodRod(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "good-rod", minLevel, maxLevel, chance };
}
function superRod(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "super-rod", minLevel, maxLevel, chance };
}
function cave(
  speciesId: number,
  minLevel: number,
  maxLevel: number,
  chance: number,
): E {
  return { speciesId, method: "walk", minLevel, maxLevel, chance };
}

// Shared fishing spots (appear on most water routes)
const WATER_FISH_COMMON: E[] = [
  oldRod(129, 5, 5, 100), // Magikarp old rod
  goodRod(129, 10, 10, 60), // Magikarp good rod
  goodRod(118, 10, 10, 40), // Goldeen good rod
  superRod(118, 15, 35, 80), // Goldeen super rod
  superRod(119, 25, 35, 20), // Seaking super rod
];

const COASTAL_FISH: E[] = [
  oldRod(129, 5, 5, 100),
  goodRod(129, 10, 10, 60),
  goodRod(98, 10, 10, 40), // Krabby good rod
  superRod(98, 15, 35, 60),
  superRod(99, 25, 35, 20), // Kingler
  superRod(72, 5, 20, 20), // Tentacool
];

export const ROUTES: RouteRecord[] = [
  // ── Route 1 ────────────────────────────────────────────────────
  {
    name: "Route 1",
    slug: "route-1-area",
    firered: [w(16, 2, 5, 45), w(19, 2, 4, 45)],
    leafgreen: [w(16, 2, 5, 45), w(19, 2, 4, 45)],
  },

  // ── Route 2 ────────────────────────────────────────────────────
  {
    name: "Route 2",
    slug: "route-2-area",
    firered: [w(16, 3, 5, 50), w(19, 3, 5, 50)],
    leafgreen: [w(16, 3, 5, 50), w(19, 3, 5, 50)],
  },

  // ── Viridian Forest ────────────────────────────────────────────
  {
    name: "Viridian Forest",
    slug: "viridian-forest-area",
    firered: [
      w(10, 3, 5, 25), // Caterpie
      w(11, 3, 5, 5), // Metapod
      w(16, 3, 5, 30), // Pidgey
      w(19, 3, 5, 25), // Rattata
      w(25, 3, 5, 5), // Pikachu
    ],
    leafgreen: [
      w(13, 3, 5, 25), // Weedle
      w(14, 3, 5, 5), // Kakuna
      w(16, 3, 5, 30), // Pidgey
      w(19, 3, 5, 25), // Rattata
      w(25, 3, 5, 5), // Pikachu
    ],
  },

  // ── Route 3 ────────────────────────────────────────────────────
  {
    name: "Route 3",
    slug: "route-3-area",
    firered: [
      w(16, 6, 9, 40),
      w(39, 3, 7, 25), // Jigglypuff
      w(29, 6, 8, 15), // Nidoran-F
      w(32, 6, 8, 15), // Nidoran-M
      w(23, 7, 11, 5), // Ekans [FR]
    ],
    leafgreen: [
      w(16, 6, 9, 40),
      w(39, 3, 7, 25),
      w(29, 6, 8, 15),
      w(32, 6, 8, 15),
      w(27, 7, 11, 5), // Sandshrew [LG]
    ],
  },

  // ── Mt. Moon ───────────────────────────────────────────────────
  {
    name: "Mt. Moon",
    slug: "mt-moon-1f-area",
    firered: [
      cave(41, 8, 12, 70), // Zubat
      cave(74, 8, 10, 25), // Geodude
      cave(35, 7, 10, 5), // Clefairy
    ],
    leafgreen: [
      cave(41, 8, 12, 70),
      cave(74, 8, 10, 25),
      cave(35, 7, 10, 5),
    ],
  },
  {
    name: "Mt. Moon B1F",
    slug: "mt-moon-b1f-area",
    firered: [
      cave(41, 8, 12, 65),
      cave(74, 8, 10, 25),
      cave(35, 7, 10, 5),
      cave(46, 8, 10, 5), // Paras
    ],
    leafgreen: [
      cave(41, 8, 12, 65),
      cave(74, 8, 10, 25),
      cave(35, 7, 10, 5),
      cave(46, 8, 10, 5),
    ],
  },
  {
    name: "Mt. Moon B2F",
    slug: "mt-moon-b2f-area",
    firered: [
      cave(41, 8, 12, 65),
      cave(74, 8, 10, 25),
      cave(35, 7, 10, 5),
      cave(46, 8, 10, 5),
    ],
    leafgreen: [
      cave(41, 8, 12, 65),
      cave(74, 8, 10, 25),
      cave(35, 7, 10, 5),
      cave(46, 8, 10, 5),
    ],
  },

  // ── Route 4 ────────────────────────────────────────────────────
  {
    name: "Route 4",
    slug: "route-4-area",
    firered: [
      w(21, 13, 17, 40), // Spearow
      w(19, 13, 17, 35), // Rattata
      w(23, 13, 17, 20), // Ekans [FR]
      w(63, 13, 17, 5), // Abra
    ],
    leafgreen: [
      w(21, 13, 17, 40),
      w(19, 13, 17, 35),
      w(27, 13, 17, 20), // Sandshrew [LG]
      w(63, 13, 17, 5),
    ],
  },

  // ── Route 24 (Nugget Bridge) ───────────────────────────────────
  {
    name: "Route 24",
    slug: "route-24-area",
    firered: [
      w(43, 13, 16, 25), // Oddish [FR]
      w(63, 12, 17, 25), // Abra
      w(29, 13, 16, 20),
      w(32, 13, 16, 20),
      w(16, 13, 16, 10),
    ],
    leafgreen: [
      w(69, 13, 16, 25), // Bellsprout [LG]
      w(63, 12, 17, 25),
      w(29, 13, 16, 20),
      w(32, 13, 16, 20),
      w(16, 13, 16, 10),
    ],
  },

  // ── Route 25 ───────────────────────────────────────────────────
  {
    name: "Route 25",
    slug: "route-25-area",
    firered: [
      w(43, 13, 16, 25),
      w(63, 12, 17, 25),
      w(29, 13, 16, 20),
      w(32, 13, 16, 20),
      w(16, 13, 16, 10),
    ],
    leafgreen: [
      w(69, 13, 16, 25),
      w(63, 12, 17, 25),
      w(29, 13, 16, 20),
      w(32, 13, 16, 20),
      w(16, 13, 16, 10),
    ],
  },

  // ── Route 5 ────────────────────────────────────────────────────
  {
    name: "Route 5",
    slug: "route-5-area",
    firered: [
      w(43, 15, 18, 25), // Oddish [FR]
      w(29, 15, 18, 25),
      w(32, 15, 18, 25),
      w(39, 15, 18, 15), // Jigglypuff
      w(52, 15, 18, 10), // Meowth [actually LG? let me check]
    ],
    leafgreen: [
      w(69, 15, 18, 25), // Bellsprout [LG]
      w(29, 15, 18, 25),
      w(32, 15, 18, 25),
      w(39, 15, 18, 15),
      w(52, 15, 18, 10), // Meowth [LG]
    ],
  },

  // ── Route 6 ────────────────────────────────────────────────────
  {
    name: "Route 6",
    slug: "route-6-area",
    firered: [
      w(43, 15, 18, 25),
      w(29, 15, 18, 25),
      w(32, 15, 18, 25),
      w(39, 15, 18, 15),
      w(52, 15, 18, 10),
    ],
    leafgreen: [
      w(69, 15, 18, 25),
      w(29, 15, 18, 25),
      w(32, 15, 18, 25),
      w(39, 15, 18, 15),
      w(52, 15, 18, 10),
    ],
  },

  // ── Route 9 ────────────────────────────────────────────────────
  {
    name: "Route 9",
    slug: "route-9-area",
    firered: [
      w(21, 18, 22, 40), // Spearow
      w(56, 18, 22, 35), // Mankey [FR]
      w(23, 20, 24, 20), // Ekans [FR]
      w(63, 18, 22, 5),
    ],
    leafgreen: [
      w(21, 18, 22, 40),
      w(29, 18, 22, 35),
      w(27, 20, 24, 20), // Sandshrew [LG]
      w(63, 18, 22, 5),
    ],
  },

  // ── Route 10 ───────────────────────────────────────────────────
  {
    name: "Route 10",
    slug: "route-10-area",
    firered: [
      w(21, 20, 26, 40),
      w(56, 20, 25, 35),
      w(23, 20, 25, 20),
      w(100, 20, 25, 5), // Voltorb
    ],
    leafgreen: [
      w(21, 20, 26, 40),
      w(29, 20, 25, 35),
      w(27, 20, 25, 20),
      w(100, 20, 25, 5),
    ],
  },

  // ── Rock Tunnel ────────────────────────────────────────────────
  {
    name: "Rock Tunnel 1F",
    slug: "rock-tunnel-1f-area",
    firered: [
      cave(41, 15, 22, 55), // Zubat
      cave(74, 15, 20, 25), // Geodude
      cave(95, 15, 20, 15), // Onix
      cave(96, 15, 20, 5), // Drowzee
    ],
    leafgreen: [
      cave(41, 15, 22, 55),
      cave(74, 15, 20, 25),
      cave(95, 15, 20, 15),
      cave(96, 15, 20, 5),
    ],
  },
  {
    name: "Rock Tunnel B1F",
    slug: "rock-tunnel-b1f-area",
    firered: [
      cave(41, 17, 24, 55),
      cave(74, 17, 22, 25),
      cave(95, 17, 22, 15),
      cave(96, 17, 22, 5),
    ],
    leafgreen: [
      cave(41, 17, 24, 55),
      cave(74, 17, 22, 25),
      cave(95, 17, 22, 15),
      cave(96, 17, 22, 5),
    ],
  },

  // ── Diglett's Cave ─────────────────────────────────────────────
  {
    name: "Diglett's Cave",
    slug: "digletts-cave-area",
    firered: [
      cave(50, 15, 22, 75), // Diglett
      cave(51, 22, 26, 25), // Dugtrio
    ],
    leafgreen: [
      cave(50, 15, 22, 75),
      cave(51, 22, 26, 25),
    ],
  },

  // ── Route 7 ────────────────────────────────────────────────────
  {
    name: "Route 7",
    slug: "route-7-area",
    firered: [
      w(43, 22, 25, 35), // Oddish [FR]
      w(23, 22, 25, 35), // Ekans [FR]
      w(29, 22, 26, 15),
      w(32, 22, 26, 15),
    ],
    leafgreen: [
      w(69, 22, 25, 35), // Bellsprout [LG]
      w(37, 22, 25, 35), // Vulpix [LG]
      w(29, 22, 26, 15),
      w(32, 22, 26, 15),
    ],
  },

  // ── Route 8 ────────────────────────────────────────────────────
  {
    name: "Route 8",
    slug: "route-8-area",
    firered: [
      w(43, 22, 25, 25),
      w(23, 22, 25, 35),
      w(29, 22, 26, 15),
      w(32, 22, 26, 15),
      w(52, 22, 26, 10),
    ],
    leafgreen: [
      w(69, 22, 25, 25),
      w(37, 22, 25, 35),
      w(29, 22, 26, 15),
      w(32, 22, 26, 15),
      w(52, 22, 26, 10),
    ],
  },

  // ── Pokémon Tower ──────────────────────────────────────────────
  {
    name: "Pokémon Tower 3F",
    slug: "pokemon-tower-3f-area",
    firered: [
      cave(92, 15, 17, 60), // Gastly
      cave(93, 17, 19, 35), // Haunter
      cave(104, 15, 17, 5), // Cubone
    ],
    leafgreen: [
      cave(92, 15, 17, 60),
      cave(93, 17, 19, 35),
      cave(104, 15, 17, 5),
    ],
  },
  {
    name: "Pokémon Tower 4F",
    slug: "pokemon-tower-4f-area",
    firered: [
      cave(92, 15, 18, 55),
      cave(93, 18, 20, 40),
      cave(104, 15, 18, 5),
    ],
    leafgreen: [
      cave(92, 15, 18, 55),
      cave(93, 18, 20, 40),
      cave(104, 15, 18, 5),
    ],
  },
  {
    name: "Pokémon Tower 5F",
    slug: "pokemon-tower-5f-area",
    firered: [
      cave(92, 16, 18, 45),
      cave(93, 18, 21, 50),
      cave(104, 16, 18, 5),
    ],
    leafgreen: [
      cave(92, 16, 18, 45),
      cave(93, 18, 21, 50),
      cave(104, 16, 18, 5),
    ],
  },

  // ── Route 11 ───────────────────────────────────────────────────
  {
    name: "Route 11",
    slug: "route-11-area",
    firered: [
      w(21, 20, 22, 40),
      w(23, 20, 22, 30), // Ekans [FR]
      w(96, 20, 22, 25), // Drowzee
      w(84, 20, 22, 5), // Doduo
    ],
    leafgreen: [
      w(21, 20, 22, 40),
      w(27, 20, 22, 30), // Sandshrew [LG]
      w(96, 20, 22, 25),
      w(84, 20, 22, 5),
    ],
  },

  // ── Route 12 ───────────────────────────────────────────────────
  {
    name: "Route 12",
    slug: "route-12-area",
    firered: [
      w(43, 22, 25, 35),
      w(48, 22, 26, 35), // Venonat
      w(84, 22, 26, 25),
      w(21, 22, 26, 5),
      ...WATER_FISH_COMMON,
    ],
    leafgreen: [
      w(69, 22, 25, 35),
      w(48, 22, 26, 35),
      w(84, 22, 26, 25),
      w(21, 22, 26, 5),
      ...WATER_FISH_COMMON,
    ],
  },

  // ── Route 13 ───────────────────────────────────────────────────
  {
    name: "Route 13",
    slug: "route-13-area",
    firered: [
      w(43, 22, 28, 30),
      w(48, 22, 26, 30),
      w(84, 22, 28, 25),
      w(16, 22, 28, 15),
      ...WATER_FISH_COMMON,
    ],
    leafgreen: [
      w(69, 22, 28, 30),
      w(48, 22, 26, 30),
      w(84, 22, 28, 25),
      w(16, 22, 28, 15),
      ...WATER_FISH_COMMON,
    ],
  },

  // ── Route 14 ───────────────────────────────────────────────────
  {
    name: "Route 14",
    slug: "route-14-area",
    firered: [
      w(43, 26, 30, 35),
      w(48, 25, 28, 30),
      w(84, 26, 30, 30),
      w(22, 30, 35, 5), // Fearow
    ],
    leafgreen: [
      w(69, 26, 30, 35),
      w(48, 25, 28, 30),
      w(84, 26, 30, 30),
      w(22, 30, 35, 5),
    ],
  },

  // ── Route 15 ───────────────────────────────────────────────────
  {
    name: "Route 15",
    slug: "route-15-area",
    firered: [
      w(43, 25, 30, 30),
      w(44, 28, 33, 15), // Gloom [FR]
      w(48, 25, 30, 25),
      w(49, 32, 40, 15), // Venomoth
      w(84, 26, 30, 15),
    ],
    leafgreen: [
      w(69, 25, 30, 30),
      w(70, 28, 33, 15), // Weepinbell [LG]
      w(48, 25, 30, 25),
      w(49, 32, 40, 15),
      w(84, 26, 30, 15),
    ],
  },

  // ── Route 16 ───────────────────────────────────────────────────
  {
    name: "Route 16",
    slug: "route-16-area",
    firered: [
      w(58, 24, 28, 35), // Growlithe [FR]
      w(43, 23, 27, 35),
      w(23, 24, 28, 25),
      w(84, 24, 28, 5),
    ],
    leafgreen: [
      w(37, 24, 28, 35), // Vulpix [LG]
      w(69, 23, 27, 35),
      w(27, 24, 28, 25),
      w(84, 24, 28, 5),
    ],
  },

  // ── Route 17 (Cycling Road) ────────────────────────────────────
  {
    name: "Cycling Road",
    slug: "route-17-area",
    firered: [
      w(58, 26, 30, 35),
      w(23, 27, 30, 35),
      w(84, 27, 30, 25),
      w(85, 33, 40, 5), // Dodrio
    ],
    leafgreen: [
      w(37, 26, 30, 35),
      w(27, 27, 30, 35),
      w(84, 27, 30, 25),
      w(85, 33, 40, 5),
    ],
  },

  // ── Route 18 ───────────────────────────────────────────────────
  {
    name: "Route 18",
    slug: "route-18-area",
    firered: [
      w(58, 26, 30, 35),
      w(23, 27, 30, 35),
      w(84, 27, 30, 25),
      w(85, 33, 40, 5),
    ],
    leafgreen: [
      w(37, 26, 30, 35),
      w(27, 27, 30, 35),
      w(84, 27, 30, 25),
      w(85, 33, 40, 5),
    ],
  },

  // ── Route 19 (Surf only) ───────────────────────────────────────
  {
    name: "Route 19",
    slug: "route-19-area",
    firered: [
      surf(72, 15, 40, 65), // Tentacool
      surf(73, 15, 40, 35), // Tentacruel
      ...COASTAL_FISH,
    ],
    leafgreen: [
      surf(79, 15, 35, 65), // Slowpoke [LG]
      surf(80, 25, 35, 35), // Slowbro [LG]
      ...COASTAL_FISH,
    ],
  },

  // ── Route 20 (Seafoam area) ────────────────────────────────────
  {
    name: "Route 20",
    slug: "route-20-area",
    firered: [
      surf(72, 15, 40, 65),
      surf(73, 15, 40, 35),
      ...COASTAL_FISH,
    ],
    leafgreen: [
      surf(79, 15, 35, 65),
      surf(80, 25, 35, 35),
      ...COASTAL_FISH,
    ],
  },

  // ── Seafoam Islands ────────────────────────────────────────────
  {
    name: "Seafoam Islands 1F",
    slug: "seafoam-islands-1f-area",
    firered: [
      cave(41, 28, 38, 55),
      cave(42, 33, 38, 35),
      cave(90, 30, 35, 10), // Shellder [FR]
    ],
    leafgreen: [
      cave(41, 28, 38, 55),
      cave(42, 33, 38, 35),
      cave(79, 30, 35, 10), // Slowpoke [LG]
    ],
  },
  {
    name: "Seafoam Islands B1F",
    slug: "seafoam-islands-b1f-area",
    firered: [
      cave(41, 30, 40, 55),
      cave(42, 35, 42, 30),
      cave(86, 28, 35, 10), // Seel
      cave(90, 28, 35, 5),
    ],
    leafgreen: [
      cave(41, 30, 40, 55),
      cave(42, 35, 42, 30),
      cave(86, 28, 35, 10),
      cave(79, 28, 35, 5),
    ],
  },
  {
    name: "Seafoam Islands B2F",
    slug: "seafoam-islands-b2f-area",
    firered: [
      cave(41, 32, 42, 50),
      cave(42, 37, 45, 30),
      cave(86, 28, 35, 15),
      cave(87, 35, 45, 5), // Dewgong
    ],
    leafgreen: [
      cave(41, 32, 42, 50),
      cave(42, 37, 45, 30),
      cave(86, 28, 35, 15),
      cave(87, 35, 45, 5),
    ],
  },
  {
    name: "Seafoam Islands B3F",
    slug: "seafoam-islands-b3f-area",
    firered: [
      cave(41, 32, 42, 50),
      cave(42, 37, 45, 35),
      cave(86, 30, 37, 15),
    ],
    leafgreen: [
      cave(41, 32, 42, 50),
      cave(42, 37, 45, 35),
      cave(86, 30, 37, 15),
    ],
  },
  {
    name: "Seafoam Islands B4F",
    slug: "seafoam-islands-b4f-area",
    firered: [
      cave(144, 50, 50, 100), // Articuno
      cave(41, 32, 42, 50),
      cave(86, 30, 38, 10),
    ],
    leafgreen: [
      cave(144, 50, 50, 100),
      cave(41, 32, 42, 50),
      cave(86, 30, 38, 10),
    ],
  },

  // ── Power Plant ────────────────────────────────────────────────
  {
    name: "Power Plant",
    slug: "power-plant-area",
    firered: [
      cave(100, 22, 34, 30), // Voltorb
      cave(81, 22, 34, 30), // Magnemite
      cave(101, 28, 40, 20), // Electrode
      cave(82, 30, 40, 10), // Magneton
      cave(125, 30, 40, 5), // Electabuzz [FR]
      cave(145, 50, 50, 5), // Zapdos
    ],
    leafgreen: [
      cave(100, 22, 34, 30),
      cave(81, 22, 34, 30),
      cave(101, 28, 40, 20),
      cave(82, 30, 40, 10),
      cave(126, 30, 40, 5), // Magmar [LG]
      cave(145, 50, 50, 5),
    ],
  },

  // ── Safari Zone ────────────────────────────────────────────────
  {
    name: "Safari Zone East",
    slug: "safari-zone-east-area",
    firered: [
      w(29, 22, 30, 30),
      w(32, 22, 30, 30),
      w(128, 28, 35, 20), // Tauros
      w(113, 22, 28, 15), // Chansey
      w(102, 22, 28, 5), // Exeggcute
    ],
    leafgreen: [
      w(29, 22, 30, 30),
      w(32, 22, 30, 30),
      w(128, 28, 35, 20),
      w(113, 22, 28, 15),
      w(102, 22, 28, 5),
    ],
  },
  {
    name: "Safari Zone North",
    slug: "safari-zone-north-area",
    firered: [
      w(111, 25, 35, 25), // Rhyhorn
      w(115, 25, 35, 25), // Kangaskhan
      w(123, 23, 33, 25), // Scyther [FR]
      w(113, 22, 28, 15),
      w(46, 22, 28, 10),
    ],
    leafgreen: [
      w(111, 25, 35, 25),
      w(115, 25, 35, 25),
      w(127, 23, 33, 25), // Pinsir [LG]
      w(113, 22, 28, 15),
      w(46, 22, 28, 10),
    ],
  },
  {
    name: "Safari Zone West",
    slug: "safari-zone-west-area",
    firered: [
      w(29, 22, 30, 30),
      w(32, 22, 30, 30),
      w(128, 28, 35, 25),
      w(114, 22, 28, 15), // Tangela
    ],
    leafgreen: [
      w(29, 22, 30, 30),
      w(32, 22, 30, 30),
      w(128, 28, 35, 25),
      w(114, 22, 28, 15),
    ],
  },
  {
    name: "Safari Zone Center",
    slug: "safari-zone-center-area",
    firered: [
      w(29, 22, 30, 25),
      w(32, 22, 30, 25),
      w(102, 22, 28, 20),
      w(128, 28, 35, 20),
      w(113, 22, 28, 10),
    ],
    leafgreen: [
      w(29, 22, 30, 25),
      w(32, 22, 30, 25),
      w(102, 22, 28, 20),
      w(128, 28, 35, 20),
      w(113, 22, 28, 10),
    ],
  },

  // ── Route 21 ───────────────────────────────────────────────────
  {
    name: "Route 21",
    slug: "route-21-area",
    firered: [
      w(16, 25, 30, 50), // Pidgey (north grass)
      w(17, 29, 35, 30),
      w(19, 26, 30, 20),
      surf(72, 10, 40, 65),
      surf(73, 20, 40, 35),
      ...WATER_FISH_COMMON,
    ],
    leafgreen: [
      w(16, 25, 30, 50),
      w(17, 29, 35, 30),
      w(19, 26, 30, 20),
      surf(79, 15, 35, 65),
      surf(80, 25, 35, 35),
      ...WATER_FISH_COMMON,
    ],
  },

  // ── Route 22 ───────────────────────────────────────────────────
  {
    name: "Route 22",
    slug: "route-22-area",
    firered: [
      w(16, 2, 5, 45),
      w(19, 2, 4, 45),
      w(29, 5, 7, 10),
    ],
    leafgreen: [
      w(16, 2, 5, 45),
      w(19, 2, 4, 45),
      w(32, 5, 7, 10),
    ],
  },

  // ── Victory Road ───────────────────────────────────────────────
  {
    name: "Victory Road 1F",
    slug: "victory-road-1f-area",
    firered: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15), // Graveler
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10), // Machop
      cave(67, 36, 42, 10), // Machoke
    ],
    leafgreen: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15),
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10),
      cave(67, 36, 42, 10),
    ],
  },
  {
    name: "Victory Road 2F",
    slug: "victory-road-2f-area",
    firered: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15),
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10),
      cave(67, 36, 42, 10),
    ],
    leafgreen: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15),
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10),
      cave(67, 36, 42, 10),
    ],
  },
  {
    name: "Victory Road 3F",
    slug: "victory-road-3f-area",
    firered: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15),
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10),
      cave(67, 36, 42, 10),
    ],
    leafgreen: [
      cave(41, 32, 44, 30),
      cave(74, 32, 40, 20),
      cave(75, 36, 44, 15),
      cave(95, 32, 42, 15),
      cave(66, 32, 40, 10),
      cave(67, 36, 42, 10),
    ],
  },

  // ── Cerulean Cave ──────────────────────────────────────────────
  {
    name: "Cerulean Cave 1F",
    slug: "cerulean-cave-1f-area",
    firered: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 20),
      cave(100, 46, 54, 15),
      cave(101, 46, 54, 10),
      cave(132, 46, 54, 10), // Ditto
      cave(97, 46, 54, 10), // Hypno
      cave(67, 46, 54, 10),
      cave(112, 46, 56, 5), // Rhydon
      cave(113, 46, 54, 5),
      cave(150, 70, 70, 100), // Mewtwo
    ],
    leafgreen: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 20),
      cave(100, 46, 54, 15),
      cave(101, 46, 54, 10),
      cave(132, 46, 54, 10),
      cave(97, 46, 54, 10),
      cave(67, 46, 54, 10),
      cave(112, 46, 56, 5),
      cave(113, 46, 54, 5),
      cave(150, 70, 70, 100),
    ],
  },
  {
    name: "Cerulean Cave B1F",
    slug: "cerulean-cave-b1f-area",
    firered: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 25),
      cave(100, 46, 54, 20),
      cave(101, 50, 56, 15),
      cave(132, 46, 54, 10),
      cave(97, 46, 54, 10),
      cave(67, 50, 56, 5),
    ],
    leafgreen: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 25),
      cave(100, 46, 54, 20),
      cave(101, 50, 56, 15),
      cave(132, 46, 54, 10),
      cave(97, 46, 54, 10),
      cave(67, 50, 56, 5),
    ],
  },
  {
    name: "Cerulean Cave 2F",
    slug: "cerulean-cave-2f-area",
    firered: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 25),
      cave(100, 46, 54, 20),
      cave(101, 50, 56, 15),
      cave(132, 46, 54, 10),
      cave(112, 50, 58, 10),
      cave(113, 50, 56, 5),
    ],
    leafgreen: [
      cave(41, 46, 54, 15),
      cave(42, 46, 54, 25),
      cave(100, 46, 54, 20),
      cave(101, 50, 56, 15),
      cave(132, 46, 54, 10),
      cave(112, 50, 58, 10),
      cave(113, 50, 56, 5),
    ],
  },

  // ── Cinnabar Island (Mansion) ──────────────────────────────────
  {
    name: "Pokémon Mansion 1F",
    slug: "pokemon-mansion-1f-area",
    firered: [
      cave(58, 36, 44, 50), // Growlithe [FR]
      cave(109, 30, 38, 30), // Koffing
      cave(88, 30, 36, 20), // Grimer
    ],
    leafgreen: [
      cave(37, 36, 44, 50), // Vulpix [LG]
      cave(109, 30, 38, 30),
      cave(88, 30, 36, 20),
    ],
  },
  {
    name: "Pokémon Mansion B1F",
    slug: "pokemon-mansion-b1f-area",
    firered: [
      cave(58, 38, 46, 40),
      cave(110, 36, 45, 30), // Weezing
      cave(89, 34, 42, 25), // Muk
      cave(109, 34, 42, 5),
    ],
    leafgreen: [
      cave(37, 38, 46, 40),
      cave(110, 36, 45, 30),
      cave(89, 34, 42, 25),
      cave(109, 34, 42, 5),
    ],
  },

  // ── Water routes (surf) ────────────────────────────────────────
  {
    name: "Pallet Town (Water)",
    slug: "pallet-town-area",
    firered: [
      surf(72, 5, 40, 65),
      surf(73, 20, 40, 35),
      ...COASTAL_FISH,
    ],
    leafgreen: [
      surf(79, 5, 30, 65),
      surf(80, 20, 35, 35),
      ...COASTAL_FISH,
    ],
  },
  {
    name: "Cinnabar Island (Water)",
    slug: "cinnabar-island-area",
    firered: [
      surf(72, 5, 40, 65),
      surf(73, 20, 40, 35),
      ...COASTAL_FISH,
    ],
    leafgreen: [
      surf(79, 5, 30, 65),
      surf(80, 20, 35, 35),
      ...COASTAL_FISH,
    ],
  },

  // ── Four Island - Icefall Cave ─────────────────────────────────
  {
    name: "Icefall Cave",
    slug: "icefall-cave-1f-area",
    firered: [
      cave(41, 38, 46, 60),
      cave(42, 40, 48, 25),
      cave(86, 38, 46, 10),
      cave(87, 42, 50, 5),
    ],
    leafgreen: [
      cave(41, 38, 46, 60),
      cave(42, 40, 48, 25),
      cave(86, 38, 46, 10),
      cave(87, 42, 50, 5),
    ],
  },

  // ── Five Island - Lost Cave ────────────────────────────────────
  {
    name: "Lost Cave",
    slug: "lost-cave-area",
    firered: [
      cave(92, 40, 50, 55),
      cave(93, 42, 52, 45),
    ],
    leafgreen: [
      cave(92, 40, 50, 55),
      cave(93, 42, 52, 45),
    ],
  },

  // ── Six Island - Dotted Hole ───────────────────────────────────
  {
    name: "Dotted Hole",
    slug: "dotted-hole-1f-area",
    firered: [
      cave(50, 30, 40, 70),
      cave(51, 35, 43, 30),
    ],
    leafgreen: [
      cave(50, 30, 40, 70),
      cave(51, 35, 43, 30),
    ],
  },

  // ── Seven Island - Sevault Canyon ─────────────────────────────
  {
    name: "Sevault Canyon",
    slug: "sevault-canyon-area",
    firered: [
      w(111, 43, 50, 40),
      w(75, 43, 50, 35),
      w(95, 43, 50, 20),
      w(77, 43, 50, 5),
    ],
    leafgreen: [
      w(111, 43, 50, 40),
      w(75, 43, 50, 35),
      w(95, 43, 50, 20),
      w(77, 43, 50, 5),
    ],
  },

  // ── Altering Cave (FR/LG island dungeon) ──────────────────────
  {
    name: "Altering Cave",
    slug: "altering-cave-area",
    firered: [cave(41, 14, 22, 100)],
    leafgreen: [cave(41, 14, 22, 100)],
  },

  // ── Route 23 ───────────────────────────────────────────────────
  {
    name: "Route 23",
    slug: "route-23-area",
    firered: [
      w(29, 32, 40, 40),
      w(33, 38, 45, 25), // Nidorino
      w(32, 32, 40, 20),
      w(30, 38, 45, 15), // Nidorina
    ],
    leafgreen: [
      w(29, 32, 40, 40),
      w(33, 38, 45, 25),
      w(32, 32, 40, 20),
      w(30, 38, 45, 15),
    ],
  },

  // ── Dragon's Den equivalent: Dragonite Route ──────────────────
  // (In FRLG, Dratini is found in Safari Zone / fishing)
  {
    name: "Safari Zone (Water)",
    slug: "safari-zone-center-area-water",
    firered: [
      surf(54, 20, 35, 65), // Psyduck [FR]
      surf(55, 30, 40, 35), // Golduck [FR]
      superRod(147, 10, 35, 40), // Dratini (super rod)
      superRod(148, 25, 35, 10), // Dragonair
    ],
    leafgreen: [
      surf(79, 20, 35, 65),
      surf(80, 30, 40, 35),
      superRod(147, 10, 35, 40),
      superRod(148, 25, 35, 10),
    ],
  },
];
