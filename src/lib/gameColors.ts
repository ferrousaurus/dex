const gameColorMap: Record<string, string> = {
  red: "red",
  blue: "blue",
  yellow: "yellow",
  gold: "yellow",
  silver: "gray",
  crystal: "cyan",
  ruby: "red",
  sapphire: "blue",
  emerald: "green",
  "fire-red": "orange",
  "leaf-green": "green",
  diamond: "indigo",
  pearl: "pink",
  platinum: "gray",
  "heart-gold": "yellow",
  "soul-silver": "gray",
  black: "dark",
  white: "gray",
  "black-2": "dark",
  "white-2": "gray",
  x: "blue",
  y: "red",
  "omega-ruby": "red",
  "alpha-sapphire": "blue",
};

export function getGameColor(slug: string): string {
  return gameColorMap[slug] ?? "gray";
}
