import type { WorkNode } from "./types";

export const realmOf = (w: WorkNode): WorkNode["realm"] => {
  const cats = w.categories.map(c => c.toLowerCase());
  if (cats.some(c => ["expérience du temps","experience du temps","nature du temps","temps cosmique","temps écologique","temps ecologique"].some(k => c.includes(k)))) return "cosmic";
  if (cats.some(c => ["temps vécu","temps vecu","temps et identité","temps et identite","temps biologique","temps et sacré","temps et sacre"].some(k => c.includes(k)))) return "human";
  if (cats.some(c => ["manipulations du temps","représentation du temps","representation du temps"].some(k => c.includes(k)))) return "disrupted";
  return "human";
};

export const realmForceCenter = (realm: string, width:number, height:number) => {
  const centers = { human: [width/2, height*0.65], cosmic: [width*0.25, height*0.25], disrupted: [width*0.75, height*0.25] } as const;
  return centers[realm as keyof typeof centers] ?? centers.human;
};
