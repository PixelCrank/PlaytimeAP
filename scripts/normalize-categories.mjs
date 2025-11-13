import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, "../Playtime_Master.csv");
const JSON_PATH = path.join(__dirname, "../src/data/works.json");

// Category normalization map
const categoryNormalization = {
  "temps et vécu": "temps vécu",
  "manipulation du temps": "manipulations du temps",
  // Add more as needed
};

// Emotion normalization (if any inconsistencies found)
const emotionNormalization = {
  "facination": "fascination", // typo found in data
};

function normalizeString(str, normMap) {
  const lower = str.toLowerCase().trim();
  return normMap[lower] ?? str;
}

function normalizeWork(work) {
  // Normalize categories
  if (work.categories && Array.isArray(work.categories)) {
    work.categories = work.categories.map(cat =>
      normalizeString(cat, categoryNormalization)
    );
  }

  // Normalize emotions
  if (work.emotions && Array.isArray(work.emotions)) {
    work.emotions = work.emotions.map(emo =>
      normalizeString(emo, emotionNormalization)
    );
  }

  return work;
}

async function main() {
  console.log("📖 Reading works.json...");
  const works = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

  console.log(`✨ Normalizing ${works.length} works...`);
  const normalized = works.map(normalizeWork);

  // Report changes
  const changes = {
    categories: new Set(),
    emotions: new Set(),
  };

  normalized.forEach((work, i) => {
    const original = works[i];
    
    if (JSON.stringify(work.categories) !== JSON.stringify(original.categories)) {
      changes.categories.add(work.id);
    }
    
    if (JSON.stringify(work.emotions) !== JSON.stringify(original.emotions)) {
      changes.emotions.add(work.id);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`  - ${changes.categories.size} works had category changes`);
  console.log(`  - ${changes.emotions.size} works had emotion changes`);

  console.log("\n💾 Writing normalized data...");
  fs.writeFileSync(JSON_PATH, JSON.stringify(normalized, null, 2), "utf-8");

  console.log("✅ Done! works.json has been normalized.");
}

main().catch(console.error);
