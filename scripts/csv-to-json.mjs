import fs from "node:fs";
import { parse } from "csv-parse/sync";

const srcPath = "./Playtime_Master.csv";
if (!fs.existsSync(srcPath)) {
  console.error("Missing Playtime_Master.csv at project root.");
  process.exit(1);
}

const src = fs.readFileSync(srcPath, "utf8");
const rows = parse(src, { columns: true });

const toArr = (v) => (v ? String(v).split(",").map(s => s.trim()).filter(Boolean) : []);
const toYear = (v) => { const m = String(v||"").match(/(19|20)\d{2}/); return m ? Number(m[0]) : null; };

const data = rows.map(r => ({
  id: r.ID,
  titre: r["Titre"],
  titreOriginal: r["Titre original"] || undefined,
  createur: r["Créateur"] || undefined,
  studioEditeur: r["Studio/Éditeur"] || undefined,
  type: r["Type"],
  medium: r["Médium"] || undefined,
  annee: r["Année"] || undefined,
  anneeNum: toYear(r["Année (numérique)"]),
  dureeFormat: r["Durée/Format"] || null,
  commentaire: r["Commentaire"] || undefined,
  lien: r["Lien"] || null,
  categories: [r["Catégorie 1"], r["Catégorie 2"], r["Catégorie 3"]].filter(Boolean),
  emotions: [r["Émotion 1"], r["Émotion 2"], r["Émotion 3"]].filter(Boolean),
  motsCles: toArr(r["Mots-clés"]),
  realm: "human"
}));

fs.mkdirSync("./src/data", { recursive: true });
fs.writeFileSync("./src/data/works.json", JSON.stringify(data, null, 2));
console.log("wrote src/data/works.json:", data.length);
