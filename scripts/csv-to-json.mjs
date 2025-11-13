import fs from "node:fs";
import { parse } from "csv-parse/sync";

const srcPath = "./playtime_merged_with_medium.csv";
if (!fs.existsSync(srcPath)) {
  console.error("Missing playtime_merged_with_medium.csv at project root.");
  process.exit(1);
}

const src = fs.readFileSync(srcPath, "utf8");
const rows = parse(src, { columns: true, skip_empty_lines: true });

// Helper: split semicolon-separated string into array
const toArr = (v) => (v ? String(v).split(";").map(s => s.trim()).filter(Boolean) : []);

// Helper: extract first 4-digit year from string
const extractYear = (v) => {
  const m = String(v || "").match(/\b(1[89]\d{2}|20\d{2})\b/);
  return m ? Number(m[0]) : null;
};

// Helper: calculate century (19 or 20) from year
const toCentury = (year) => {
  if (!year) return null;
  return year < 1900 ? 19 : 20;
};

// Helper: categorize realm based on categories
const categorizeRealm = (categories) => {
  const text = categories.join(" ").toLowerCase();
  
  if (text.includes("temps cosmique") || 
      text.includes("nature du temps") || 
      text.includes("temps et espace") ||
      text.includes("temps géologique") ||
      text.includes("temps écologique")) {
    return "cosmic";
  }
  
  if (text.includes("manipulations du temps") || 
      text.includes("manipulation du temps") ||
      text.includes("représentation du temps") ||
      text.includes("temps et rêve")) {
    return "disrupted";
  }
  
  return "human";
};

// Filter out rows that are not "item" type (like section headers)
const items = rows.filter(r => r.type_ligne === "item");

const data = items.map((r, index) => {
  const year = extractYear(r.annee);
  const categories = toArr(r.categories);
  
  return {
    id: r.id_interne || `item-${index + 1}`,
    titre: r.titre || "Sans titre",
    titreOriginal: r.titre_original || undefined,
    createur: r.createur || undefined,
    studioEditeur: r.producteur || undefined,
    type: r.domaine || "Art", // domaine is the medium type
    medium: r.medium_technique || r.support_plateforme || undefined,
    annee: r.annee || undefined,
    anneeNum: toCentury(year),
    dureeFormat: r.duree_ou_dimensions || r.volumes || null,
    commentaire: r.commentaire || undefined,
    lien: r.extrait_media || null,
    categories: categories,
    emotions: toArr(r.emotions),
    motsCles: toArr(r.mots_cles),
    realm: categorizeRealm(categories)
  };
});

fs.mkdirSync("./src/data", { recursive: true });
fs.writeFileSync("./src/data/works.json", JSON.stringify(data, null, 2));
console.log(`✅ Wrote src/data/works.json: ${data.length} works from ${items.length} items`);

// Print distribution stats
const typeCount = {};
const realmCount = {};
const centuryCount = {};

data.forEach(w => {
  typeCount[w.type] = (typeCount[w.type] || 0) + 1;
  realmCount[w.realm] = (realmCount[w.realm] || 0) + 1;
  if (w.anneeNum) centuryCount[w.anneeNum] = (centuryCount[w.anneeNum] || 0) + 1;
});

console.log("\n📊 Distribution by medium:");
Object.entries(typeCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`  ${k}: ${v}`);
});

console.log("\n🌍 Distribution by realm:");
Object.entries(realmCount).forEach(([k, v]) => {
  console.log(`  ${k}: ${v}`);
});

console.log("\n📅 Distribution by century:");
Object.entries(centuryCount).sort().forEach(([k, v]) => {
  console.log(`  ${k}th: ${v}`);
});
