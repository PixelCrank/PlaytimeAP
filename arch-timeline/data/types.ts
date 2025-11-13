// Type definitions for architecture timeline data

export interface Figure {
  name: string;
}

export interface Work {
  title: string;
  year?: string;
  imageUrl?: string;
}

export interface MacroMovement {
  id: string;
  name: string;
  start: number;
  end: number;
  description?: string;
  colorClass: string;
  children: string[];
  imageUrl?: string;
}

export interface ChildMovement {
  id: string;
  name: string;
  start: number;
  end: number;
  region: string;
  figures?: Figure[];
  traits?: string[];
  works?: Work[];
  texts?: string[];
  parent: string;
  imageUrl?: string;
  subchildren?: string[];
}

export interface SubChild {
  id: string;
  name: string;
  type: 'work' | 'figure';
  year?: number;
  location?: string;
  imageUrl?: string;
  role?: string;
  author?: string;
  parent: string;
}