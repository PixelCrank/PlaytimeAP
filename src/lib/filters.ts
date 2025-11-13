import type { WorkNode } from "./types";

export type FilterState = {
  types: string[];
  categories: string[];
  emotions: string[];
  yearRange: [number, number] | null;
  search: string;
  centuryFilter?: 19 | 20 | null;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const extractYear = (work: WorkNode): number | null => {
  if (typeof work.anneeNum === "number") {
    return Number.isFinite(work.anneeNum) ? work.anneeNum : null;
  }

  if (typeof work.annee === "string" && work.annee.trim().length > 0) {
    const match = work.annee.match(/\d{3,4}/);
    if (match) {
      const parsed = Number.parseInt(match[0], 10);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }

  return null;
};

export const buildPredicate = (filters: FilterState) => {
  const typeSet = new Set(filters.types.filter(Boolean));
  const categorySet = new Set(filters.categories.filter(Boolean));
  const emotionSet = new Set(filters.emotions.filter(Boolean));
  const range = filters.yearRange;
  const searchTerm = filters.search.trim().length > 0 ? normalize(filters.search.trim()) : "";

  return (work: WorkNode) => {
    if (typeSet.size > 0 && !typeSet.has(work.type)) {
      return false;
    }

    if (categorySet.size > 0) {
      const match = work.categories?.some(category => categorySet.has(category));
      if (!match) {
        return false;
      }
    }

    if (emotionSet.size > 0) {
      const match = work.emotions?.some(emotion => emotionSet.has(emotion));
      if (!match) {
        return false;
      }
    }

    if (range) {
      const year = extractYear(work);
      if (year === null || year < range[0] || year > range[1]) {
        return false;
      }
    }

    if (searchTerm) {
      const haystack = [
        work.titre,
        work.titreOriginal,
        work.createur,
        work.studioEditeur,
        work.commentaire,
        ...(work.motsCles ?? []),
        ...(work.categories ?? []),
      ]
        .filter(Boolean)
        .map(value => normalize(String(value)))
        .join(" ");

      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  };
};

export const buildPredicateWithCentury = (filters: FilterState, centuryFilter: 19 | 20 | null) => {
  const typeSet = new Set(filters.types.filter(Boolean));
  const categorySet = new Set(filters.categories.filter(Boolean));
  const emotionSet = new Set(filters.emotions.filter(Boolean));
  const range = filters.yearRange;
  const searchTerm = filters.search.trim().length > 0 ? normalize(filters.search.trim()) : "";

  return (work: WorkNode) => {
    // Type filter (must match if specified)
    if (typeSet.size > 0 && !typeSet.has(work.type)) {
      return false;
    }

    // Search filter (must match if specified)
    if (searchTerm) {
      const haystack = [
        work.titre,
        work.titreOriginal,
        work.createur,
        work.studioEditeur,
        work.commentaire,
        ...(work.motsCles ?? []),
        ...(work.categories ?? []),
      ]
        .filter(Boolean)
        .map(value => normalize(String(value)))
        .join(" ");

      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    // Year range filter (must match if specified)
    if (range) {
      const year = extractYear(work);
      if (year === null || year < range[0] || year > range[1]) {
        return false;
      }
    }

    // For journeys: if any filter is set, work must match at least one
    const hasAnyFilter = categorySet.size > 0 || emotionSet.size > 0 || centuryFilter !== null;
    
    if (!hasAnyFilter) {
      return true; // No filters, show all
    }

    let matches = false;

    // Check categories (OR within categories)
    if (categorySet.size > 0) {
      const categoryMatch = work.categories?.some(category => categorySet.has(category));
      if (categoryMatch) matches = true;
    }

    // Check emotions (OR within emotions)
    if (emotionSet.size > 0) {
      const emotionMatch = work.emotions?.some(emotion => emotionSet.has(emotion));
      if (emotionMatch) matches = true;
    }

    // Check century
    if (centuryFilter !== null) {
      if (typeof work.anneeNum === "number" && work.anneeNum === centuryFilter) {
        matches = true;
      }
    }

    return matches;
  };
};
