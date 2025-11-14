import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_PATH = path.join(__dirname, "../src/data/works.json");

console.log("📖 Reading works.json...");
const works = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

console.log(`✨ Cleaning ${works.length} works...\n`);

const emotionFixes = {
  "facination": "fascination",
  "suprise": "surprise",
  "vigilence": "vigilance",
  "mémoire": null // Remove - not an emotion
};

const categoryFixes = {
  "temps et vécu": "temps vécu",
  "experience du temps": "expérience du temps",
  "représentations du temps": "représentation du temps",
  "temps et espce": "temps et espace" // typo
};

let emotionChanges = 0;
let categoryChanges = 0;
let emotionsRemoved = 0;

works.forEach(work => {
  // Fix emotions
  if (work.emotions) {
    work.emotions = work.emotions
      .map(e => {
        if (emotionFixes[e] !== undefined) {
          if (emotionFixes[e] === null) {
            emotionsRemoved++;
            return null;
          }
          emotionChanges++;
          return emotionFixes[e];
        }
        return e;
      })
      .filter(e => e !== null);
  }
  
  // Fix categories
  if (work.categories) {
    work.categories = work.categories.map(c => {
      if (categoryFixes[c]) {
        categoryChanges++;
        return categoryFixes[c];
      }
      return c;
    });
  }
});

console.log(`📊 Changes made:`);
console.log(`  - ${emotionChanges} emotion typos fixed`);
console.log(`  - ${emotionsRemoved} invalid emotions removed`);
console.log(`  - ${categoryChanges} categories normalized`);

console.log("\n💾 Writing cleaned data...");
fs.writeFileSync(JSON_PATH, JSON.stringify(works, null, 2), "utf-8");

console.log("✅ Data cleaned successfully!");

// Show new stats
const emotions = {};
const categories = {};
works.forEach(w => {
  w.emotions?.forEach(e => emotions[e] = (emotions[e] || 0) + 1);
  w.categories?.forEach(c => categories[c] = (categories[c] || 0) + 1);
});

console.log("\n📈 Updated emotion counts:");
Object.entries(emotions).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([e, c]) => 
  console.log(`  ${e}: ${c}`)
);

console.log("\n📈 Updated category counts:");
Object.entries(categories).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([c, count]) => 
  console.log(`  ${c}: ${count}`)
);
