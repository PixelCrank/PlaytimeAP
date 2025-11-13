import { MacroMovement, ChildMovement, TimelineBuilding, TimelineFigure } from './timelineData';

const cleanString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const splitList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => cleanString(entry))
      .filter((entry) => entry.length > 0);
  }
  return cleanString(value)
    .split(/[,;•\n]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const pickFirst = (row: Record<string, unknown>, candidates: string[]): string => {
  for (const key of candidates) {
    if (row && row[key] !== undefined && row[key] !== null) {
      const value = cleanString(row[key]);
      if (value) return value;
    }
  }
  return '';
};

const parseYear = (value: unknown): number | undefined => {
  const cleaned = cleanString(value);
  if (!cleaned) return undefined;
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const normaliseId = (value: string, fallback: string) => {
  const cleaned = cleanString(value);
  if (cleaned) return cleaned;
  return fallback;
};

const lower = (value: string): string => cleanString(value).toLowerCase();

const buildTimelineBuilding = (row: Record<string, unknown>, fallbackId: string): TimelineBuilding => {
  const city = cleanString(row['City']);
  const country = cleanString(row['Country']);
  const location = [city, country].filter(Boolean).join(', ');

  return {
  id: normaliseId(cleanString(row['Building Name']), fallbackId),
    name: cleanString(row['Building Name']),
    type: 'work',
    description: pickFirst(row, ['Description']),
    extendedDescription: pickFirst(row, ['Description (extended)', 'Description (Extended)', 'Description.1']),
    imageUrl: pickFirst(row, ['Image URL']),
    city,
    country,
    location,
    yearsBuilt: cleanString(row['Year(s) Built']),
    architects: cleanString(row['Architect(s)']),
    patron: cleanString(row['Patron / Commissioner']),
    functionType: cleanString(row['Function / Type']),
    functionTags: splitList(row['Function / Type']),
    uniqueFeaturesText: pickFirst(row, ['Unique or Salient Features ', 'Unique or Salient Features']),
    uniqueFeatures: splitList(row['Unique or Salient Features '] ?? row['Unique or Salient Features']),
    materialsText: cleanString(row['Materials & Techniques']),
    materials: splitList(row['Materials & Techniques']),
    symbolismText: cleanString(row['Symbolism / Message']),
    symbolism: splitList(row['Symbolism / Message']),
    currentStatus: cleanString(row['Current Status']),
    sources: cleanString(row['Sources / References']),
    raw: row,
  };
};

const buildTimelineFigure = (row: Record<string, unknown>, fallbackId: string): TimelineFigure => ({
  id: normaliseId(cleanString(row['Architect']), fallbackId),
  name: cleanString(row['Architect']),
  type: 'figure',
  description: pickFirst(row, ['Description', 'Philosophy / Design Approach']),
  imageUrl: pickFirst(row, ['Image URL']),
  lifeDates: cleanString(row['Life Dates']),
  nationality: cleanString(row['Nationality / Region']),
  education: cleanString(row['Education / Training']),
  philosophy: cleanString(row['Philosophy / Design Approach']),
  aesthetics: cleanString(row['Key aesthetics or forms']),
  anecdotes: pickFirst(row, ['Interesting Personal story or Anecdotes']),
  majorWorks: splitList(row['Major Works (comma-separated)'] ?? row['Major Works']),
  keyWritings: splitList(row['Key Writings (comma-separated)'] ?? row['Key Writings']),
  influence: cleanString(row['Influence / Legacy']),
  sources: cleanString(row['Sources / References']),
  notes: cleanString(row['Notes']),
  raw: row,
});

// Converts Google Sheets API data to the app's timeline data structure
export function convertSheetsToTimelineFormat(
  sheetData: Record<string, Record<string, string>[]>
): { macros: MacroMovement[]; children: ChildMovement[] } {
  if (!sheetData || !sheetData.Macros || !sheetData.Movements) {
    return { macros: [], children: [] };
  }

  const movementRows: Record<string, unknown>[] = sheetData.Movements || [];
  const buildingRows: Record<string, unknown>[] = sheetData.Buildings || [];
  const figureRows: Record<string, unknown>[] = sheetData.Figures || [];

  const childMovements: ChildMovement[] = movementRows.map((movement, index) => {
    const movementName = cleanString(movement['Sub-Movement']);
    const movementKey = lower(movementName);

    const works: TimelineBuilding[] = buildingRows
      .filter((building) => lower(building['Linked Sub-Movement (must match Movements sheet)'] as string) === movementKey)
      .map((building, buildingIndex) =>
        buildTimelineBuilding(building, `${movementKey || `movement-${index + 1}`}-building-${buildingIndex + 1}`)
      );

    const figures: TimelineFigure[] = figureRows
      .filter((figure) => lower(figure['Linked Sub-Movement (must match Movements sheet)'] as string) === movementKey)
      .map((figure, figureIndex) =>
        buildTimelineFigure(figure, `${movementKey || `movement-${index + 1}`}-figure-${figureIndex + 1}`)
      );

    const startYear = parseYear(movement['Start Year']);
    const endYear = parseYear(movement['End Year']);
    const startYearLabel = cleanString(movement['Start Year']);
    const endYearLabel = cleanString(movement['End Year']);
    const yearsLabel = [startYearLabel || (startYear !== undefined ? String(startYear) : ''), endYearLabel || (endYear !== undefined ? String(endYear) : '')]
      .filter(Boolean)
      .join(' – ');

    return {
      id: movementName || `movement-${index + 1}`,
      name: movementName || `Movement ${index + 1}`,
      parent: cleanString(movement['Macro Parent (choose)']),
      overview: pickFirst(movement, ['Description']),
      description: pickFirst(movement, ['Hallmark Traits']),
      start: startYear,
      end: endYear,
      startYearLabel: startYearLabel || undefined,
      endYearLabel: endYearLabel || undefined,
      yearsLabel: yearsLabel || undefined,
      region: cleanString(movement['Region']),
      geography: pickFirst(movement, ['Geography / Regions', 'Region']),
      socialPoliticalContext: pickFirst(movement, ['Social / Political Context']),
      philosophicalIdeas: pickFirst(movement, ['Philosophical Ideas']),
      hallmarkTraits: splitList(movement['Hallmark Traits']),
      keyTexts: splitList(movement['Key Texts / Theory']),
      canonicalWorks: splitList(movement['Canonical Works (comma-separated)']),
      keyFiguresList: splitList(movement['Key Figures (comma-separated)']),
      notes: pickFirst(movement, ['Notes / Sources']),
      imageUrl: pickFirst(movement, ['Image URL']),
      localImagePath: pickFirst(movement, ['Image File (local path)']),
      works,
      figures,
    };
  });

  const macros: MacroMovement[] = (sheetData.Macros || []).map((macro: Record<string, unknown>, index: number) => {
    const name = cleanString(macro['Name']) || `Macro ${index + 1}`;
    const slug = cleanString(macro['Slug']);

    const childIds = childMovements
      .filter((movement) => movement.parent && movement.parent.toLowerCase() === name.toLowerCase())
      .map((movement) => movement.id);

    return {
      id: normaliseId(slug || name, `macro-${index + 1}`),
      slug: slug || undefined,
      name,
      description: pickFirst(macro, ['Description']),
      start: parseYear(macro['Start']),
      end: parseYear(macro['End']),
      macroNamesList: splitList(macro['MacroNames_List']),
      colorClass: cleanString(macro['colorClass']),
      imageUrl: pickFirst(macro, ['imageUrl', 'ImageUrl', 'Image URL']),
      children: childIds,
    };
  });

  return { macros, children: childMovements };
}
