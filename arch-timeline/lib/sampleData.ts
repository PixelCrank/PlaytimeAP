// Sample content to populate the CMS
// You can use this as a reference or import it programmatically

export const sampleMacroMovements = [
  {
    name: "Ancient & Classical Traditions",
    slug: "ancient-classical",
    startYear: -3000,
    endYear: 500,
    description: "The foundational architectural traditions of ancient civilizations, establishing principles of monumentality, proportion, and structural innovation that would influence architecture for millennia.",
    colorClass: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
    order: 1
  },
  {
    name: "Medieval & Cross-Cultural Sacred",
    slug: "medieval-sacred",
    startYear: 300,
    endYear: 1500,
    description: "Sacred architecture across cultures, featuring innovations in vertical construction, spiritual symbolism, and cross-cultural architectural exchange.",
    colorClass: "bg-gradient-to-r from-purple-600 to-purple-700 text-white",
    order: 2
  },
  {
    name: "Renaissance & Early Modern",
    slug: "renaissance-early-modern",
    startYear: 1400,
    endYear: 1800,
    description: "Revival of classical principles combined with new innovations in design, engineering, and artistic expression.",
    colorClass: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white",
    order: 3
  },
  {
    name: "Modern Movement",
    slug: "modern-movement",
    startYear: 1880,
    endYear: 1980,
    description: "Revolutionary approach to architecture emphasizing function, new materials, and rejection of historical styles.",
    colorClass: "bg-gradient-to-r from-orange-600 to-orange-700 text-white",
    order: 4
  },
  {
    name: "Contemporary Architecture",
    slug: "contemporary",
    startYear: 1980,
    endYear: 2025,
    description: "Diverse approaches including high-tech, postmodern, deconstructivist, sustainable, and parametric design.",
    colorClass: "bg-gradient-to-r from-lime-600 to-lime-700 text-white",
    order: 5
  }
];

export const sampleChildMovements = [
  // Ancient & Classical
  {
    name: "Ancient Egyptian",
    slug: "ancient-egyptian",
    startYear: -3000,
    endYear: -332,
    region: "Egypt",
    description: "Monumental stone architecture characterized by massive scale, axiality, and post-and-lintel construction.",
    traits: ["Monumental stone construction", "Axiality and symmetry", "Post-and-lintel system", "Pyramidal forms", "Hieroglyphic decoration"],
    parentMovement: "ancient-classical"
  },
  {
    name: "Classical Greek",
    slug: "classical-greek",
    startYear: -600,
    endYear: -323,
    region: "Greek World",
    description: "Development of the classical orders and principles of proportion that became foundational to Western architecture.",
    traits: ["Classical orders (Doric, Ionic, Corinthian)", "Mathematical proportions", "Peripteral temples", "Marble construction", "Sculptural integration"],
    parentMovement: "ancient-classical"
  },
  {
    name: "Roman Imperial",
    slug: "roman-imperial",
    startYear: -509,
    endYear: 476,
    region: "Roman Empire",
    description: "Revolutionary engineering achievements with concrete, arches, vaults, and domes enabling unprecedented scales.",
    traits: ["Concrete construction", "Arch and vault systems", "Dome technology", "Infrastructure projects", "Urban planning"],
    parentMovement: "ancient-classical"
  },

  // Medieval & Sacred
  {
    name: "Byzantine",
    slug: "byzantine",
    startYear: 330,
    endYear: 1453,
    region: "Eastern Mediterranean",
    description: "Synthesis of Roman engineering with Christian symbolism, featuring innovative dome construction.",
    traits: ["Domes on pendentives", "Mosaic decoration", "Centralized plans", "Iconographic programs", "Light manipulation"],
    parentMovement: "medieval-sacred"
  },
  {
    name: "Gothic",
    slug: "gothic",
    startYear: 1140,
    endYear: 1500,
    region: "Western Europe",
    description: "Revolutionary vertical architecture with flying buttresses enabling soaring heights and luminous interiors.",
    traits: ["Pointed arches", "Flying buttresses", "Ribbed vaulting", "Large windows", "Vertical emphasis"],
    parentMovement: "medieval-sacred"
  },
  {
    name: "Islamic Architecture",
    slug: "islamic-architecture",
    startYear: 620,
    endYear: 1500,
    region: "Islamic World",
    description: "Geometric patterns, courtyards, and innovative structural solutions across diverse cultural contexts.",
    traits: ["Geometric patterns", "Courtyard typology", "Muqarnas", "Calligraphic decoration", "Mathematical proportions"],
    parentMovement: "medieval-sacred"
  },

  // Renaissance & Early Modern
  {
    name: "Italian Renaissance",
    slug: "italian-renaissance",
    startYear: 1400,
    endYear: 1600,
    region: "Italy",
    description: "Revival and reinterpretation of classical principles with new humanistic ideals and artistic innovation.",
    traits: ["Classical revival", "Linear perspective", "Humanistic proportions", "Unified compositions", "Artistic integration"],
    parentMovement: "renaissance-early-modern"
  },
  {
    name: "Baroque",
    slug: "baroque",
    startYear: 1600,
    endYear: 1750,
    region: "Europe & Colonies",
    description: "Dynamic, theatrical architecture emphasizing movement, light, and emotional impact.",
    traits: ["Dynamic forms", "Theatrical effects", "Light manipulation", "Curved geometries", "Ornate decoration"],
    parentMovement: "renaissance-early-modern"
  },

  // Modern Movement
  {
    name: "International Style",
    slug: "international-style",
    startYear: 1920,
    endYear: 1970,
    region: "Global",
    description: "Functionalist approach with steel, glass, and concrete construction rejecting historical ornament.",
    traits: ["Steel frame construction", "Curtain wall systems", "Minimal ornament", "Functional expression", "Universal principles"],
    parentMovement: "modern-movement"
  },
  {
    name: "Brutalism",
    slug: "brutalism",
    startYear: 1950,
    endYear: 1980,
    region: "Global",
    description: "Raw concrete construction emphasizing massive, monolithic forms and honest material expression.",
    traits: ["Raw concrete (béton brut)", "Monolithic forms", "Repetitive angular elements", "Fortress-like appearance", "Social housing focus"],
    parentMovement: "modern-movement"
  },

  // Contemporary
  {
    name: "High-Tech Architecture",
    slug: "high-tech",
    startYear: 1970,
    endYear: 2000,
    region: "Global",
    description: "Celebration of technology and engineering with exposed structural systems and industrial materials.",
    traits: ["Exposed structure", "Industrial materials", "Technological expression", "Flexibility", "Modular systems"],
    parentMovement: "contemporary"
  },
  {
    name: "Sustainable Design",
    slug: "sustainable-design",
    startYear: 1990,
    endYear: 2025,
    region: "Global",
    description: "Environmentally conscious architecture integrating energy efficiency, renewable materials, and ecological principles.",
    traits: ["Energy efficiency", "Renewable materials", "Passive design strategies", "Green roofs/walls", "LEED certification"],
    parentMovement: "contemporary"
  }
];

export const sampleArchitecturalWorks = [
  // Ancient Egyptian
  {
    name: "Great Pyramid of Giza",
    slug: "great-pyramid-giza",
    year: -2580,
    location: "Giza, Egypt",
    description: "Monumental tomb demonstrating extraordinary precision in stone construction and astronomical alignment.",
    architect: "Unknown",
    parentMovement: "ancient-egyptian"
  },
  {
    name: "Temple of Karnak",
    slug: "temple-karnak",
    year: -2000,
    location: "Luxor, Egypt",
    description: "Vast temple complex showcasing Egyptian architectural principles over centuries of development.",
    architect: "Multiple builders",
    parentMovement: "ancient-egyptian"
  },

  // Classical Greek
  {
    name: "Parthenon",
    slug: "parthenon",
    year: -447,
    location: "Athens, Greece",
    description: "Pinnacle of Doric architecture demonstrating perfect mathematical proportions and optical refinements.",
    architect: "Iktinos and Kallikrates",
    parentMovement: "classical-greek"
  },
  {
    name: "Erechtheion",
    slug: "erechtheion",
    year: -421,
    location: "Athens, Greece",
    description: "Elegant Ionic temple featuring the famous Caryatid porch.",
    architect: "Mnesicles",
    parentMovement: "classical-greek"
  },

  // Roman Imperial
  {
    name: "Pantheon",
    slug: "pantheon",
    year: 128,
    location: "Rome, Italy",
    description: "Revolutionary concrete dome construction creating unprecedented interior space.",
    architect: "Apollodorus of Damascus",
    parentMovement: "roman-imperial"
  },
  {
    name: "Colosseum",
    slug: "colosseum",
    year: 80,
    location: "Rome, Italy",
    description: "Masterpiece of Roman engineering with complex circulation and structural systems.",
    architect: "Unknown",
    parentMovement: "roman-imperial"
  },

  // Byzantine
  {
    name: "Hagia Sophia",
    slug: "hagia-sophia",
    year: 537,
    location: "Istanbul, Turkey",
    description: "Architectural synthesis achieving unprecedented dome scale through innovative pendentive construction.",
    architect: "Anthemius of Tralles and Isidore of Miletus",
    parentMovement: "byzantine"
  },

  // Gothic
  {
    name: "Notre-Dame de Paris",
    slug: "notre-dame-paris",
    year: 1345,
    location: "Paris, France",
    description: "Gothic cathedral demonstrating flying buttress technology and luminous interior space.",
    architect: "Multiple master builders",
    parentMovement: "gothic"
  },
  {
    name: "Chartres Cathedral",
    slug: "chartres-cathedral",
    year: 1220,
    location: "Chartres, France",
    description: "Perfect example of High Gothic architecture with unified design and spectacular stained glass.",
    architect: "Unknown master builder",
    parentMovement: "gothic"
  },

  // Islamic Architecture
  {
    name: "Dome of the Rock",
    slug: "dome-of-rock",
    year: 691,
    location: "Jerusalem",
    description: "Early Islamic monument combining Byzantine and Persian influences with geometric decoration.",
    architect: "Raja ibn Haywah and Yazid ibn Salam",
    parentMovement: "islamic-architecture"
  },
  {
    name: "Alhambra",
    slug: "alhambra",
    year: 1370,
    location: "Granada, Spain",
    description: "Masterpiece of Islamic palatial architecture with intricate geometric and calligraphic decoration.",
    architect: "Multiple craftsmen",
    parentMovement: "islamic-architecture"
  },

  // Italian Renaissance
  {
    name: "Brunelleschi's Dome, Florence Cathedral",
    slug: "brunelleschi-dome",
    year: 1436,
    location: "Florence, Italy",
    description: "Revolutionary dome construction reviving ancient Roman techniques with innovative engineering.",
    architect: "Filippo Brunelleschi",
    parentMovement: "italian-renaissance"
  },
  {
    name: "Palazzo Medici",
    slug: "palazzo-medici",
    year: 1460,
    location: "Florence, Italy",
    description: "Prototype of Renaissance palace design establishing new urban architectural language.",
    architect: "Michelozzo",
    parentMovement: "italian-renaissance"
  },

  // Baroque
  {
    name: "St. Peter's Basilica",
    slug: "st-peters-basilica",
    year: 1626,
    location: "Vatican City",
    description: "Culmination of Renaissance and Baroque architectural achievement with Bernini's dramatic colonnade.",
    architect: "Multiple architects including Bramante, Michelangelo, Bernini",
    parentMovement: "baroque"
  },

  // International Style
  {
    name: "Villa Savoye",
    slug: "villa-savoye",
    year: 1931,
    location: "Poissy, France",
    description: "Manifesto of modernist principles: pilotis, free plan, horizontal windows, roof garden, free facade.",
    architect: "Le Corbusier",
    parentMovement: "international-style"
  },
  {
    name: "Seagram Building",
    slug: "seagram-building",
    year: 1958,
    location: "New York, USA",
    description: "Epitome of International Style corporate architecture with bronze and glass curtain wall.",
    architect: "Mies van der Rohe and Philip Johnson",
    parentMovement: "international-style"
  },

  // Brutalism
  {
    name: "Unité d'Habitation",
    slug: "unite-habitation",
    year: 1952,
    location: "Marseille, France",
    description: "Pioneering brutalist housing block demonstrating béton brut construction and social ideals.",
    architect: "Le Corbusier",
    parentMovement: "brutalism"
  },
  {
    name: "Barbican Centre",
    slug: "barbican-centre",
    year: 1982,
    location: "London, UK",
    description: "Monumental brutalist complex integrating housing, arts venues, and urban landscape.",
    architect: "Chamberlin, Powell and Bon",
    parentMovement: "brutalism"
  },

  // High-Tech
  {
    name: "Centre Pompidou",
    slug: "centre-pompidou",
    year: 1977,
    location: "Paris, France",
    description: "Revolutionary high-tech architecture with externalized mechanical systems and flexible interior.",
    architect: "Renzo Piano and Richard Rogers",
    parentMovement: "high-tech"
  },
  {
    name: "Lloyd's Building",
    slug: "lloyds-building",
    year: 1986,
    location: "London, UK",
    description: "High-tech masterpiece with exposed structural and mechanical systems creating dramatic urban presence.",
    architect: "Richard Rogers",
    parentMovement: "high-tech"
  },

  // Sustainable Design
  {
    name: "BioQ",
    slug: "bioq",
    year: 2022,
    location: "Copenhagen, Denmark",
    description: "Cutting-edge sustainable office building with carbon-negative construction and integrated ecosystems.",
    architect: "3XN",
    parentMovement: "sustainable-design"
  }
];

export const sampleKeyFigures = [
  // Ancient
  {
    name: "Imhotep",
    slug: "imhotep",
    birthYear: -2650,
    deathYear: -2600,
    role: "Architect, Engineer, Physician",
    description: "First known architect in history, designer of the Step Pyramid of Djoser, establishing stone construction principles.",
    parentMovement: "ancient-egyptian"
  },
  {
    name: "Vitruvius",
    slug: "vitruvius",
    birthYear: -80,
    deathYear: -15,
    role: "Architect, Engineer, Writer",
    description: "Roman architect whose 'Ten Books on Architecture' became the foundational architectural treatise.",
    parentMovement: "roman-imperial"
  },

  // Medieval
  {
    name: "Anthemius of Tralles",
    slug: "anthemius-tralles",
    birthYear: 474,
    deathYear: 558,
    role: "Mathematician, Architect",
    description: "Co-architect of Hagia Sophia, combining mathematical precision with innovative structural engineering.",
    parentMovement: "byzantine"
  },
  {
    name: "Abbot Suger",
    slug: "abbot-suger",
    birthYear: 1081,
    deathYear: 1151,
    role: "Abbot, Architectural Patron",
    description: "Visionary patron of Saint-Denis, credited with developing Gothic architectural principles.",
    parentMovement: "gothic"
  },

  // Renaissance
  {
    name: "Filippo Brunelleschi",
    slug: "filippo-brunelleschi",
    birthYear: 1377,
    deathYear: 1446,
    role: "Architect, Engineer",
    description: "Pioneer of Renaissance architecture, famous for the dome of Florence Cathedral and linear perspective.",
    parentMovement: "italian-renaissance"
  },
  {
    name: "Leon Battista Alberti",
    slug: "leon-battista-alberti",
    birthYear: 1404,
    deathYear: 1472,
    role: "Architect, Theorist, Humanist",
    description: "Renaissance polymath who wrote influential architectural treatises and designed innovative facades.",
    parentMovement: "italian-renaissance"
  },
  {
    name: "Andrea Palladio",
    slug: "andrea-palladio",
    birthYear: 1508,
    deathYear: 1580,
    role: "Architect",
    description: "Most influential architect of the Renaissance, codified classical principles in 'Four Books of Architecture'.",
    parentMovement: "italian-renaissance"
  },

  // Baroque
  {
    name: "Gian Lorenzo Bernini",
    slug: "gian-lorenzo-bernini",
    birthYear: 1598,
    deathYear: 1680,
    role: "Architect, Sculptor",
    description: "Master of Baroque architecture and sculpture, designer of St. Peter's Square colonnade.",
    parentMovement: "baroque"
  },
  {
    name: "Francesco Borromini",
    slug: "francesco-borromini",
    birthYear: 1599,
    deathYear: 1667,
    role: "Architect",
    description: "Innovative Baroque architect known for complex geometric forms and spatial experimentation.",
    parentMovement: "baroque"
  },

  // Modern
  {
    name: "Le Corbusier",
    slug: "le-corbusier",
    birthYear: 1887,
    deathYear: 1965,
    role: "Architect, Urban Planner, Theorist",
    description: "Pioneer of modern architecture, formulated Five Points of Architecture and Modulor proportional system.",
    parentMovement: "international-style"
  },
  {
    name: "Ludwig Mies van der Rohe",
    slug: "mies-van-der-rohe",
    birthYear: 1886,
    deathYear: 1969,
    role: "Architect",
    description: "Master of minimal modernism, famous for 'Less is more' philosophy and steel-and-glass construction.",
    parentMovement: "international-style"
  },
  {
    name: "Frank Lloyd Wright",
    slug: "frank-lloyd-wright",
    birthYear: 1867,
    deathYear: 1959,
    role: "Architect",
    description: "Pioneer of organic architecture, integrating buildings with their natural environment.",
    parentMovement: "modern-movement"
  },

  // Contemporary
  {
    name: "Norman Foster",
    slug: "norman-foster",
    birthYear: 1935,
    role: "Architect",
    description: "Leading high-tech architect, pioneer of sustainable design and innovative structural systems.",
    parentMovement: "high-tech"
  },
  {
    name: "Zaha Hadid",
    slug: "zaha-hadid",
    birthYear: 1950,
    deathYear: 2016,
    role: "Architect",
    description: "First woman to win Pritzker Prize, pioneer of parametric design and fluid architectural forms.",
    parentMovement: "contemporary"
  },
  {
    name: "Bjarke Ingels",
    slug: "bjarke-ingels",
    birthYear: 1974,
    role: "Architect",
    description: "Innovative contemporary architect combining sustainability, functionality, and bold conceptual thinking.",
    parentMovement: "sustainable-design"
  }
];