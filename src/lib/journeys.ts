// Guided journey presets based on corpus analysis
export type Journey = {
  id: string;
  name: string;
  description: string;
  realms?: Array<"cosmic" | "human" | "disrupted">;
  categories?: string[];
  emotions?: string[];
  century?: 19 | 20 | null;
};

export const journeys: Journey[] = [
  {
    id: "cosmos-intime",
    name: "Du cosmos à l'intime",
    description: "Des œuvres cosmologiques vers l'introspection personnelle",
    realms: ["cosmic", "human"],
    categories: ["nature du temps", "temps cosmique", "temps vécu", "temps et identité"],
    emotions: ["fascination", "sérénité", "nostalgie"],
  },
  {
    id: "anxiete-temporelle",
    name: "Anxiété temporelle",
    description: "Bugs temporels, fin du monde, surveillance du temps",
    realms: ["disrupted"],
    categories: ["manipulations du temps", "représentation du temps"],
    emotions: ["peur", "vigilance", "tension", "excitation"],
  },
  {
    id: "rituels-sacre",
    name: "Rituels & sacré",
    description: "Temps biologique, rites et mémoire collective",
    realms: ["human"],
    categories: ["temps et sacré", "temps biologique", "temps et identité"],
    emotions: ["sérénité", "confiance", "tristesse"],
  },
  {
    id: "nostalgie-19e",
    name: "Nostalgie du XIXe",
    description: "Canon historique et mélancolie temporelle",
    century: 19,
    emotions: ["nostalgie", "tristesse"],
  },
  {
    id: "disruption-20e",
    name: "Disruptions contemporaines",
    description: "Manipulations modernes du temps (cinéma, jeux vidéo)",
    century: 20,
    realms: ["disrupted"],
    categories: ["manipulations du temps", "temps et rêve"],
    emotions: ["surprise", "excitation"],
  },
];
