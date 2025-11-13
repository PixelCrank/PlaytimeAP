export type Emotion = string;
export type Category = string;
export type MediaType = "Art" | "Cinéma" | "Littérature" | "Jeux vidéo" | "BD" | "Music";

export interface WorkNode {
  id: string;
  titre: string;
  titreOriginal?: string;
  createur?: string;
  studioEditeur?: string;
  type: MediaType;
  medium?: string;
  annee?: string;
  anneeNum?: number | null;
  dureeFormat?: string | null;
  commentaire?: string;
  lien?: string | null;
  categories: Category[];
  emotions: Emotion[];
  motsCles: string[];
  realm: "cosmic" | "human" | "disrupted";
}
