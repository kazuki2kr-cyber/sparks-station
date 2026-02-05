
interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: Record<string, { official: string; common: string }>;
    };
    translations: {
        jpn?: { common: string; official: string };
    };
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    population: number;
    area: number;
    region: string;
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    // Optional metadata for strict typing if needed, 
    // but the game only uses the above fields.
    imageUrl?: string; // We might need this for flag quizzes!
    questionType?: 'flag' | 'population' | 'area';
}

// Cache to store countries data
let countriesCache: Country[] | null = null;

const fetchCountries = async (): Promise<Country[]> => {
    if (countriesCache) return countriesCache;

    try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,area,region,translations");
        if (!res.ok) throw new Error("Failed to fetch countries data");
        const data = await res.json();
        countriesCache = data;
        return data;
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
};

const getRandomItems = <T>(arr: T[], count: number, exclude?: T[]): T[] => {
    const pool = exclude ? arr.filter(item => !exclude.includes(item)) : [...arr];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Japanese name helper
const getJpName = (country: Country): string => {
    return country.translations.jpn?.common || country.name.common;
};

// Question Generators
const generateFlagQuestion = (countries: Country[]): Question => {
    const [correct, ...wrong] = getRandomItems(countries, 4);
    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    return {
        id: `flag-${Date.now()}-${Math.random()}`,
        text: "この国旗の国はどこ？", // Special handling might be needed for image display
        options: options.map(getJpName),
        correctIndex: options.indexOf(correct),
        imageUrl: correct.flags.png, // We need to handle this in UI!
        questionType: 'flag'
    };
};

const generatePopulationQuestion = (countries: Country[]): Question => {
    // Select 4 countries with somewhat distant populations to be fair? 
    // For now random is fine, or maybe "Which has the LARGEST population?"
    const choices = getRandomItems(countries, 4);

    // Sort by population desc to find winner
    const sorted = [...choices].sort((a, b) => b.population - a.population);
    const correct = sorted[0];

    // Shuffle choices for display
    const options = choices.sort(() => 0.5 - Math.random());

    return {
        id: `pop-${Date.now()}-${Math.random()}`,
        text: "次のうち、最も人口が多い国は？",
        options: options.map(getJpName),
        correctIndex: options.indexOf(correct),
        questionType: 'population'
    };
};

const generateAreaQuestion = (countries: Country[]): Question => {
    const choices = getRandomItems(countries, 4);
    const sorted = [...choices].sort((a, b) => b.area - a.area);
    const correct = sorted[0];
    const options = choices.sort(() => 0.5 - Math.random());

    return {
        id: `area-${Date.now()}-${Math.random()}`,
        text: "次のうち、国土面積が最も広い国は？",
        options: options.map(getJpName),
        correctIndex: options.indexOf(correct),
        questionType: 'area'
    };
};

export const fetchAndGenerateWorldQuestions = async (count: number = 10): Promise<Question[]> => {
    const countries = await fetchCountries();
    if (countries.length === 0) return [];

    // Filter out very small entities without Japanese names if any
    const validCountries = countries.filter(c => c.translations.jpn);

    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        if (rand < 0.4) {
            questions.push(generateFlagQuestion(validCountries));
        } else if (rand < 0.7) {
            questions.push(generatePopulationQuestion(validCountries));
        } else {
            questions.push(generateAreaQuestion(validCountries));
        }
    }

    return questions;
};
