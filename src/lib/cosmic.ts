/**
 * Deterministic astrology + numerology generator.
 * Pure functions — no external services, no future-outcome guarantees.
 * All outputs are presented as reflective/entertainment content.
 */

export type PredictionInput = {
  fullName: string;
  preferredName?: string;
  gender?: string;
  city?: string;
  country?: string;
  dob: string;          // YYYY-MM-DD
  time?: string;        // HH:mm, optional if unknown
  unknownTime?: boolean;
  birthCity?: string;
  birthCountry?: string;
  lifeGoals?: string;
  relationshipStatus?: string;
  readingType: "astrology" | "numerology" | "combined";
};

export type ZodiacSign = {
  name: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  rulingPlanet: string;
  traits: string[];
  summary: string;
};

const SIGNS: { name: string; symbol: string; from: [number, number]; to: [number, number]; element: ZodiacSign["element"]; modality: ZodiacSign["modality"]; planet: string; traits: string[]; summary: string }[] = [
  { name: "Capricorn",   symbol: "♑", from: [12,22], to: [1,19],  element:"Earth", modality:"Cardinal", planet:"Saturn",  traits:["Disciplined","Ambitious","Pragmatic"], summary:"Builder of lasting structures, drawn to mastery and meaningful achievement." },
  { name: "Aquarius",    symbol: "♒", from: [1,20],  to: [2,18],  element:"Air",   modality:"Fixed",    planet:"Uranus",  traits:["Inventive","Independent","Humanitarian"], summary:"Visionary mind seeking progress, freedom, and collective uplift." },
  { name: "Pisces",      symbol: "♓", from: [2,19],  to: [3,20],  element:"Water", modality:"Mutable",  planet:"Neptune", traits:["Intuitive","Empathic","Creative"], summary:"Dreamer attuned to feeling, art, and the unseen currents of life." },
  { name: "Aries",       symbol: "♈", from: [3,21],  to: [4,19],  element:"Fire",  modality:"Cardinal", planet:"Mars",    traits:["Bold","Pioneering","Energetic"], summary:"Spark of beginnings — courageous, direct, and quick to act." },
  { name: "Taurus",      symbol: "♉", from: [4,20],  to: [5,20],  element:"Earth", modality:"Fixed",    planet:"Venus",   traits:["Grounded","Sensual","Patient"], summary:"Steady cultivator of beauty, comfort, and enduring value." },
  { name: "Gemini",      symbol: "♊", from: [5,21],  to: [6,20],  element:"Air",   modality:"Mutable",  planet:"Mercury", traits:["Curious","Witty","Adaptable"], summary:"Messenger of ideas, weaving connection through language and play." },
  { name: "Cancer",      symbol: "♋", from: [6,21],  to: [7,22],  element:"Water", modality:"Cardinal", planet:"Moon",    traits:["Nurturing","Protective","Intuitive"], summary:"Keeper of home and feeling, deeply loyal to your inner circle." },
  { name: "Leo",         symbol: "♌", from: [7,23],  to: [8,22],  element:"Fire",  modality:"Fixed",    planet:"Sun",     traits:["Radiant","Generous","Expressive"], summary:"Heart of the room — warm, creative, and naturally inspiring." },
  { name: "Virgo",       symbol: "♍", from: [8,23],  to: [9,22],  element:"Earth", modality:"Mutable",  planet:"Mercury", traits:["Analytical","Refined","Helpful"], summary:"Quiet craftsperson improving the world through precise, useful work." },
  { name: "Libra",       symbol: "♎", from: [9,23],  to: [10,22], element:"Air",   modality:"Cardinal", planet:"Venus",   traits:["Diplomatic","Aesthetic","Fair"], summary:"Seeker of harmony and beauty, gifted at finding the elegant middle." },
  { name: "Scorpio",     symbol: "♏", from: [10,23], to: [11,21], element:"Water", modality:"Fixed",    planet:"Pluto",   traits:["Intense","Magnetic","Transformative"], summary:"Depth diver who turns shadow into power through honest seeing." },
  { name: "Sagittarius", symbol: "♐", from: [11,22], to: [12,21], element:"Fire",  modality:"Mutable",  planet:"Jupiter", traits:["Adventurous","Philosophical","Optimistic"], summary:"Truth seeker forever expanding horizons through travel and ideas." },
];

export function zodiacFor(dob: string): ZodiacSign {
  const d = new Date(dob + "T00:00:00");
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const match = SIGNS.find((s) => {
    const [fm, fd] = s.from, [tm, td] = s.to;
    if (fm === tm) return m === fm && day >= fd && day <= td;
    // wraps year
    if (fm > tm) return (m === fm && day >= fd) || (m === tm && day <= td);
    return (m === fm && day >= fd) || (m === tm && day <= td) || (m > fm && m < tm);
  }) ?? SIGNS[0];
  return {
    name: match.name, symbol: match.symbol, element: match.element,
    modality: match.modality, rulingPlanet: match.planet,
    traits: match.traits, summary: match.summary,
  };
}

const sumDigits = (n: number): number => {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
};

export function lifePathNumber(dob: string): number {
  const digits = dob.replace(/\D/g, "").split("").map(Number);
  return sumDigits(digits.reduce((a, b) => a + b, 0));
}

const LETTER_VALUES: Record<string, number> = {
  A:1,J:1,S:1, B:2,K:2,T:2, C:3,L:3,U:3, D:4,M:4,V:4,
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9,
};

export function destinyNumber(name: string): number {
  const total = name.toUpperCase().replace(/[^A-Z]/g, "").split("")
    .reduce((acc, ch) => acc + (LETTER_VALUES[ch] ?? 0), 0);
  return sumDigits(total);
}

const NUMBER_MEANINGS: Record<number, { title: string; essence: string; strengths: string[]; growth: string[]; career: string[]; learning: string }> = {
  1: { title:"The Pioneer", essence:"Independent and original, called to lead with vision.", strengths:["Initiative","Leadership","Originality"], growth:["Patience with others","Receiving help"], career:["Founder","Director","Designer"], learning:"Learn by doing — fast prototypes and bold first attempts." },
  2: { title:"The Diplomat", essence:"Sensitive, cooperative, gifted at creating harmony.", strengths:["Empathy","Tact","Partnership"], growth:["Self-assertion","Decisiveness"], career:["Counselor","Mediator","Curator"], learning:"Learn through conversation, listening, and one-on-one mentorship." },
  3: { title:"The Storyteller", essence:"Expressive, joyful, a natural communicator and creator.", strengths:["Creativity","Charisma","Optimism"], growth:["Focus","Following through"], career:["Writer","Performer","Marketer"], learning:"Learn by expressing — teach it, draw it, or speak it aloud." },
  4: { title:"The Architect", essence:"Reliable and methodical, building solid foundations.", strengths:["Discipline","Practicality","Loyalty"], growth:["Flexibility","Embracing change"], career:["Engineer","Operator","Researcher"], learning:"Learn through structured practice, repetition, and clear systems." },
  5: { title:"The Explorer", essence:"Curious, freedom-loving, energized by variety and motion.", strengths:["Adaptability","Curiosity","Courage"], growth:["Commitment","Grounding routines"], career:["Travel","Sales","Journalism"], learning:"Learn by immersion — new places, languages, and hands-on experiments." },
  6: { title:"The Caretaker", essence:"Warm-hearted, responsible, devoted to home and community.", strengths:["Nurturing","Service","Aesthetic sense"], growth:["Boundaries","Self-care"], career:["Teacher","Healer","Designer"], learning:"Learn through service and helping others master what you study." },
  7: { title:"The Seeker", essence:"Analytical and introspective, drawn to wisdom and the unseen.", strengths:["Insight","Research","Spiritual depth"], growth:["Trust","Sharing inner life"], career:["Scientist","Analyst","Philosopher"], learning:"Learn through deep solitude, reading, and quiet reflection." },
  8: { title:"The Builder", essence:"Ambitious and capable, balancing material and spiritual power.", strengths:["Strategy","Authority","Resilience"], growth:["Generosity","Surrender"], career:["Executive","Investor","Producer"], learning:"Learn through stewardship — managing real resources and outcomes." },
  9: { title:"The Humanitarian", essence:"Compassionate idealist with a heart for the collective.", strengths:["Compassion","Vision","Artistry"], growth:["Letting go","Personal needs"], career:["Activist","Artist","Therapist"], learning:"Learn through service to causes larger than yourself." },
  11:{ title:"The Illuminator", essence:"Master intuitive — inspiration channeled into the world.", strengths:["Vision","Intuition","Inspiration"], growth:["Nervous-system care","Grounding"], career:["Spiritual teacher","Innovator","Artist"], learning:"Learn through meditation, dreams, and inspired flashes." },
  22:{ title:"The Master Builder", essence:"Practical visionary, capable of large-scale creation.", strengths:["Vision + execution","Leadership","Endurance"], growth:["Pacing","Delegation"], career:["Founder of institutions","Architect","Statesman"], learning:"Learn by building real things that outlast the moment." },
  33:{ title:"The Master Teacher", essence:"Selfless service through wisdom, healing, and love.", strengths:["Compassion","Wisdom","Healing presence"], growth:["Self-preservation","Boundaries"], career:["Healer","Teacher","Counselor"], learning:"Learn through deep service and mentorship of others." },
};

const LUCKY_COLORS: Record<ZodiacSign["element"], string[]> = {
  Fire:  ["Crimson", "Burnt orange", "Sun gold"],
  Earth: ["Forest green", "Terracotta", "Bronze"],
  Air:   ["Sky blue", "Silver", "Soft lavender"],
  Water: ["Deep indigo", "Sea green", "Pearl white"],
};

export type Prediction = {
  zodiac: ZodiacSign;
  lifePath: number;
  destiny: number;
  meaningLife: typeof NUMBER_MEANINGS[1];
  meaningDestiny: typeof NUMBER_MEANINGS[1];
  luckyNumbers: number[];
  luckyColors: string[];
  daily: string;
  relationships: string;
  career: string;
  guidance: string;
  generatedAt: string;
};

const seedFrom = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
};

export function generatePrediction(input: PredictionInput): Prediction {
  const zodiac = zodiacFor(input.dob);
  const lp = lifePathNumber(input.dob);
  const dn = destinyNumber(input.preferredName || input.fullName);
  const ml = NUMBER_MEANINGS[lp] ?? NUMBER_MEANINGS[1];
  const md = NUMBER_MEANINGS[dn] ?? NUMBER_MEANINGS[1];
  const seed = seedFrom(input.fullName + input.dob);

  const lucky = Array.from({ length: 4 }).map((_, i) => ((seed >> (i * 3)) % 88) + 1);
  // ensure life path is included
  const luckyNumbers = Array.from(new Set([lp, ...lucky])).slice(0, 5);

  const dailyPool = [
    "Today favors quiet observation — notice what repeats and let it inform your next move.",
    "An unexpected message may reorder your day; let curiosity outweigh resistance.",
    "Small, deliberate acts compound. Choose one meaningful task and complete it fully.",
    "A conversation could shift a stuck pattern. Speak the simple truth first.",
    "Rest is productive today. Let the body lead, and the mind will follow.",
  ];
  const guidancePool = [
    "Trust the slow build. What feels ordinary now is the foundation of something lasting.",
    "Your sensitivity is data, not weakness — listen to what it's pointing toward.",
    "Pair your ambition with rest; the cosmos rewards rhythm over raw force.",
    "Where you feel resistance, look for the lesson hidden inside the discomfort.",
    "Move toward what makes you feel alive — that is the compass worth following.",
  ];
  const relPool = [
    "You thrive with partners who match your honesty and respect your pace.",
    "Connection deepens when you let yourself be seen, not just admired.",
    "Communication is your secret weapon — small clarifications prevent big rifts.",
    "Choose people who celebrate your growth rather than fearing it.",
  ];
  const careerPool = [
    "Roles that combine vision with craft suit you best — make and ship, don't only plan.",
    "You're at your strongest when given autonomy and a clear outcome to own.",
    "Mentorship — giving or receiving — accelerates your next chapter notably.",
    "Side projects often reveal your real direction before your day job does.",
  ];

  return {
    zodiac,
    lifePath: lp,
    destiny: dn,
    meaningLife: ml,
    meaningDestiny: md,
    luckyNumbers,
    luckyColors: LUCKY_COLORS[zodiac.element],
    daily: dailyPool[seed % dailyPool.length],
    relationships: relPool[(seed >> 3) % relPool.length],
    career: careerPool[(seed >> 5) % careerPool.length],
    guidance: guidancePool[(seed >> 7) % guidancePool.length],
    generatedAt: new Date().toISOString(),
  };
}
