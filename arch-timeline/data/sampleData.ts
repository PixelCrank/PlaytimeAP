export const SAMPLE_TIMELINE_DATA = {
  macroMovements: [
    {
      _id: "modern-movement",
      name: "Modern Movement",
      slug: "modern-movement", 
      startYear: 1920,
      endYear: 1970,
      description: "Modernist architectural movement emphasizing function and rejecting ornamentation",
      colorClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
      image: null,
      order: 1
    },
    {
      _id: "art-deco",
      name: "Art Deco",
      slug: "art-deco",
      startYear: 1910,
      endYear: 1940,
      description: "Decorative arts movement with geometric patterns and luxury materials",
      colorClass: "bg-gradient-to-r from-purple-500 to-pink-500",
      image: null,
      order: 2
    },
    {
      _id: "contemporary",
      name: "Contemporary Architecture",
      slug: "contemporary",
      startYear: 1970,
      endYear: 2024,
      description: "Current architectural trends emphasizing sustainability and technology",
      colorClass: "bg-gradient-to-r from-green-500 to-teal-500", 
      image: null,
      order: 3
    },
    {
      _id: "classical",
      name: "Classical Architecture",
      slug: "classical",
      startYear: -500,
      endYear: 500,
      description: "Ancient Greek and Roman architectural principles",
      colorClass: "bg-gradient-to-r from-yellow-600 to-orange-600",
      image: null,
      order: 4
    },
    {
      _id: "gothic",
      name: "Gothic Architecture", 
      slug: "gothic",
      startYear: 1140,
      endYear: 1500,
      description: "Medieval architectural style with pointed arches and ribbed vaults",
      colorClass: "bg-gradient-to-r from-indigo-600 to-purple-600",
      image: null,
      order: 5
    }
  ],
  childMovements: [
    {
      _id: "bauhaus",
      name: "Bauhaus",
      slug: "bauhaus",
      startYear: 1919,
      endYear: 1933,
      region: "Germany",
      traits: ["Functionalism", "Geometric forms", "Industrial materials", "Minimal ornamentation"],
      image: null,
      parentMovement: "modern-movement"
    },
    {
      _id: "international-style",
      name: "International Style",
      slug: "international-style", 
      startYear: 1930,
      endYear: 1970,
      region: "Global",
      traits: ["Glass curtain walls", "Open interior spaces", "Flat roofs", "Geometric forms"],
      image: null,
      parentMovement: "modern-movement"
    },
    {
      _id: "brutalism",
      name: "Brutalism",
      slug: "brutalism",
      startYear: 1950,
      endYear: 1980,
      region: "Europe & North America",
      traits: ["Raw concrete", "Monolithic forms", "Fortress-like appearance", "Repetitive angular elements"],
      image: null,
      parentMovement: "modern-movement"
    },
    {
      _id: "streamline-moderne",
      name: "Streamline Moderne",
      slug: "streamline-moderne",
      startYear: 1930,
      endYear: 1950,
      region: "United States",
      traits: ["Horizontal emphasis", "Curved corners", "Nautical elements", "Machine aesthetics"],
      image: null,
      parentMovement: "art-deco"
    },
    {
      _id: "high-tech",
      name: "High-tech Architecture",
      slug: "high-tech",
      startYear: 1970,
      endYear: 2000,
      region: "Global",
      traits: ["Exposed structure", "Industrial materials", "Technological integration", "Flexibility"],
      image: null,
      parentMovement: "contemporary"
    },
    {
      _id: "deconstructivism",
      name: "Deconstructivism", 
      slug: "deconstructivism",
      startYear: 1980,
      endYear: 2010,
      region: "Global",
      traits: ["Fragmented forms", "Non-rectilinear shapes", "Unpredictable geometry", "Visual complexity"],
      image: null,
      parentMovement: "contemporary"
    }
  ],
  works: [
    {
      _id: "villa-savoye",
      name: "Villa Savoye",
      year: 1931,
      location: "Poissy, France",
      image: null,
      parentMovement: "bauhaus"
    },
    {
      _id: "seagram-building",
      name: "Seagram Building",
      year: 1958,
      location: "New York City, USA",
      image: null,
      parentMovement: "international-style"
    },
    {
      _id: "barbican-centre",
      name: "Barbican Centre",
      year: 1982,
      location: "London, UK", 
      image: null,
      parentMovement: "brutalism"
    },
    {
      _id: "chrysler-building",
      name: "Chrysler Building",
      year: 1930,
      location: "New York City, USA",
      image: null,
      parentMovement: "streamline-moderne"
    },
    {
      _id: "pompidou-centre",
      name: "Centre Pompidou",
      year: 1977,
      location: "Paris, France",
      image: null,
      parentMovement: "high-tech"
    },
    {
      _id: "guggenheim-bilbao",
      name: "Guggenheim Museum Bilbao",
      year: 1997,
      location: "Bilbao, Spain",
      image: null,
      parentMovement: "deconstructivism"
    }
  ],
  figures: [
    {
      _id: "le-corbusier",
      name: "Le Corbusier",
      role: "Architect & Urban Planner",
      timelineYear: 1920,
      parentMovement: "bauhaus"
    },
    {
      _id: "mies-van-der-rohe",
      name: "Ludwig Mies van der Rohe", 
      role: "Architect",
      timelineYear: 1930,
      parentMovement: "international-style"
    },
    {
      _id: "ernő-goldfinger",
      name: "Ernő Goldfinger",
      role: "Architect",
      timelineYear: 1960,
      parentMovement: "brutalism"
    },
    {
      _id: "norman-foster",
      name: "Norman Foster",
      role: "Architect",
      timelineYear: 1975,
      parentMovement: "high-tech"
    },
    {
      _id: "frank-gehry", 
      name: "Frank Gehry",
      role: "Architect",
      timelineYear: 1990,
      parentMovement: "deconstructivism"
    }
  ]
};