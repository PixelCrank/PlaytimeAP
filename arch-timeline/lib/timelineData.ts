
// Timeline data types for the Google Sheets driven architecture timeline

export interface TimelineBuilding {
  id: string;
  name: string;
  type: 'work';
  description?: string;
  extendedDescription?: string;
  imageUrl?: string;
  city?: string;
  country?: string;
  location?: string;
  yearsBuilt?: string;
  architects?: string;
  patron?: string;
  functionType?: string;
  functionTags?: string[];
  uniqueFeaturesText?: string;
  uniqueFeatures?: string[];
  materialsText?: string;
  materials?: string[];
  symbolismText?: string;
  symbolism?: string[];
  currentStatus?: string;
  sources?: string;
  raw?: Record<string, unknown>;
}

export interface TimelineFigure {
  id: string;
  name: string;
  type: 'figure';
  description?: string;
  imageUrl?: string;
  lifeDates?: string;
  nationality?: string;
  education?: string;
  philosophy?: string;
  aesthetics?: string;
  anecdotes?: string;
  majorWorks?: string[];
  keyWritings?: string[];
  influence?: string;
  sources?: string;
  notes?: string;
  raw?: Record<string, unknown>;
}

export interface ChildMovement {
  id: string;
  name: string;
  parent?: string;
  overview?: string;
  description?: string;
  start?: number;
  end?: number;
  startYearLabel?: string;
  endYearLabel?: string;
  yearsLabel?: string;
  region?: string;
  geography?: string;
  socialPoliticalContext?: string;
  philosophicalIdeas?: string;
  hallmarkTraits?: string[];
  keyTexts?: string[];
  canonicalWorks?: string[];
  keyFiguresList?: string[];
  notes?: string;
  imageUrl?: string;
  localImagePath?: string;
  works?: TimelineBuilding[];
  figures?: TimelineFigure[];
}

export interface MacroMovement {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  start?: number;
  end?: number;
  macroNamesList?: string[];
  colorClass?: string;
  children?: string[];
  imageUrl?: string;
}
