import type { MacroMovement, ChildMovement } from "@/lib/timelineData";

export type SourceLink = { label: string; href?: string };

export const splitList = (input?: string | string[] | null): string[] => {
  if (!input) return [];
  const values = Array.isArray(input) ? input : input.split(/[\n;,]+/);
  return values
    .map((value) => value.trim())
    .filter((value, index, array) => value.length > 0 && array.indexOf(value) === index);
};

export const parseSourceLinks = (input?: string | string[] | null): SourceLink[] => {
  const raw = splitList(input);
  return raw
    .map((entry) => {
      const match = entry.match(/https?:\/\/[^\s)]+/i);
      if (match) {
        const href = match[0];
        const label = entry.replace(href, "").trim() || href;
        return { href, label } satisfies SourceLink;
      }
      return entry.length > 0 ? ({ label: entry } satisfies SourceLink) : null;
    })
    .filter((value): value is SourceLink => Boolean(value));
};

export const formatYear = (value?: number | null): string | null => {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) return null;
  if (value < 0) return `${Math.abs(value)} BCE`;
  return `${value} CE`;
};

export const formatRange = (start?: number | null, end?: number | null): string | null => {
  const startLabel = formatYear(start);
  const endLabel = formatYear(end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel ?? endLabel ?? null;
};

export const formatMacroYears = (macro?: MacroMovement | null): string | null => {
  if (!macro) return null;
  return formatRange(macro.start, macro.end);
};

export const formatMovementYears = (movement?: ChildMovement | null): string | null => {
  if (!movement) return null;
  if (movement.yearsLabel) return movement.yearsLabel;
  const startLabel = movement.startYearLabel ?? formatYear(movement.start);
  const endLabel = movement.endYearLabel ?? formatYear(movement.end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel ?? endLabel ?? null;
};

export const getChronoStart = (entity?: { start?: number | null }): number => {
  if (!entity || entity.start === null || entity.start === undefined) return Number.POSITIVE_INFINITY;
  return Number.isFinite(entity.start) ? (entity.start as number) : Number.POSITIVE_INFINITY;
};

// Extract start year from various date formats
export const extractStartYear = (dateString?: string | null): number | null => {
  if (!dateString) return null;
  
  // Try to match a 4-digit year at the start
  const match = dateString.match(/^(\d{4})/);
  if (match) return parseInt(match[1], 10);
  
  // Try to match BCE dates
  const bceMatch = dateString.match(/(\d+)\s*BCE/i);
  if (bceMatch) return -parseInt(bceMatch[1], 10);
  
  return null;
};
