import { ART_WORKS, ARTIST_POOL } from "./artData";

interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    imageUrl?: string;
    timeLimit?: number;
    questionType?: 'art';
}

// Met Museum API Base URL
const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

export async function fetchArtQuestions(amount: number = 10): Promise<Question[]> {
    // 1. Shuffle and select artworks
    const shuffledWorks = [...ART_WORKS].sort(() => 0.5 - Math.random());
    const selectedWorks = shuffledWorks.slice(0, amount);

    const questions: Question[] = [];

    // 2. Process each work
    for (const work of selectedWorks) {
        try {
            // Fetch image from API
            const res = await fetch(`${BASE_URL}/${work.id}`);
            if (!res.ok) continue; // Skip if API fails

            const data = await res.json();
            const imageUrl = data.primaryImageSmall || data.primaryImage;

            if (!imageUrl) continue; // Skip if no image

            // Generate Options
            // Correct Answer: work.artist
            // Incorrect Answers: 3 random from ARTIST_POOL valid

            const options = new Set<string>();
            options.add(work.artist);

            while (options.size < 4) {
                const randomArtist = ARTIST_POOL[Math.floor(Math.random() * ARTIST_POOL.length)];
                // Ensure we don't pick the correct artist as extended wrong option (though strict compare handles it)
                // And simplify names if needed? No, user wants English.
                if (randomArtist !== work.artist) {
                    options.add(randomArtist);
                }
            }

            const shuffledOptions = Array.from(options).sort(() => 0.5 - Math.random());
            const correctIndex = shuffledOptions.indexOf(work.artist);

            questions.push({
                id: `art-${work.id}-${Date.now()}`,
                text: "この作品の作者は誰ですか？", // Japanese Text
                imageUrl: imageUrl,                    // API Image
                options: shuffledOptions,              // English Options
                correctIndex: correctIndex,
                timeLimit: 15 // Giving a bit more time for art appreciation? Or stick to 10. Let's do 15.
            });

        } catch (error) {
            console.error(`Failed to fetch artwork ${work.id}`, error);
        }
    }

    // Fill remaining if failed (though unlikely with good IDs)
    // For now returning what we have.
    return questions;
}
