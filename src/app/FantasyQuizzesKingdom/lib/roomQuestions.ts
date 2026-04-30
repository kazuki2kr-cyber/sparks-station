import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchAndGenerateWorldQuestions } from "./worldQuiz";

type SourceQuestion = {
    text?: string;
    options?: string[];
    choices?: string[];
    correctIndex?: number;
    correctAnswer?: number;
    timeLimit?: number;
    points?: number;
    category?: string;
    imageUrl?: string | null;
};

function shuffleChoices(choices: string[], correctIndex: number) {
    const choiceObjects = choices.map((text, i) => ({
        text,
        isCorrect: i === correctIndex,
    }));

    for (let i = choiceObjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choiceObjects[i], choiceObjects[j]] = [choiceObjects[j], choiceObjects[i]];
    }

    return {
        choices: choiceObjects.map((choice) => choice.text),
        correctAnswer: choiceObjects.findIndex((choice) => choice.isCorrect),
    };
}

async function clearRoomQuestions(roomId: string) {
    const questionsRef = collection(db, "rooms", roomId, "questions");
    const existingQSnap = await getDocs(questionsRef);
    const deleteBatch = writeBatch(db);

    existingQSnap.docs.forEach((questionDoc) => {
        deleteBatch.delete(questionDoc.ref);
    });

    if (!existingQSnap.empty) {
        await deleteBatch.commit();
    }
    return questionsRef;
}

export async function replaceRoomQuestions(roomId: string, categoryId: string) {
    const questionsRef = await clearRoomQuestions(roomId);
    const batch = writeBatch(db);
    let writtenCount = 0;

    if (categoryId === "world_master") {
        const worldQuestions = await fetchAndGenerateWorldQuestions(10);
        worldQuestions.forEach((question, index) => {
            batch.set(doc(questionsRef), {
                text: question.text,
                choices: question.options,
                correctAnswer: question.correctIndex,
                timeLimit: 20,
                points: 1000,
                createdAt: Date.now() + index,
                order: index,
                imageUrl: question.imageUrl || null,
            });
            writtenCount++;
        });
    } else if (categoryId === "art_master") {
        const { fetchArtQuestions } = await import("./artQuiz");
        const artQuestions = await fetchArtQuestions(10);
        artQuestions.forEach((question, index) => {
            batch.set(doc(questionsRef), {
                text: question.text,
                choices: question.options,
                correctAnswer: question.correctIndex,
                timeLimit: question.timeLimit || 20,
                points: 1000,
                createdAt: Date.now() + index,
                order: index,
                imageUrl: question.imageUrl || null,
            });
            writtenCount++;
        });
    } else {
        const globalSnap = await getDocs(collection(db, "questions"));
        let allQuestions = globalSnap.docs.map((questionDoc) => questionDoc.data() as SourceQuestion);

        if (categoryId !== "all") {
            allQuestions = allQuestions.filter((question) => question.category === categoryId);
        }

        const selected = allQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

        selected.forEach((question, index) => {
            const originalChoices = question.options || question.choices || [];
            const originalCorrectIndex = question.correctIndex ?? question.correctAnswer ?? 0;

            if (originalChoices.length === 0) return;

            const shuffled = shuffleChoices(originalChoices, originalCorrectIndex);
            batch.set(doc(questionsRef), {
                text: question.text || "No Question Text",
                choices: shuffled.choices,
                correctAnswer: shuffled.correctAnswer,
                timeLimit: question.timeLimit || 20,
                points: question.points || 1000,
                createdAt: Date.now() + index,
                order: index,
                imageUrl: question.imageUrl || null,
            });
            writtenCount++;
        });
    }

    if (writtenCount === 0) {
        throw new Error("No questions were generated for this category.");
    }

    await batch.commit();
    return writtenCount;
}
