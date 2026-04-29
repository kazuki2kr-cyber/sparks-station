import { realtimeDb } from "@/lib/firebase";
import {
    DataSnapshot,
    DatabaseReference,
    child,
    get,
    increment,
    off,
    onValue,
    ref,
    remove,
    set,
    update,
} from "firebase/database";

export interface LiveRoomState {
    status: "waiting" | "playing" | "finished";
    currentQuestionIndex: number;
    currentPhase: "waiting" | "question" | "result" | "finished";
    startTime?: number;
    hostId: string;
    hostName?: string;
    roomName?: string;
    type?: string;
    category?: string | null;
    categoryName?: string | null;
    hostParticipates?: boolean;
    createdAt?: number;
    shortId?: string;
}

export interface LivePlayer {
    id: string;
    name: string;
    iconUrl: string;
    score: number;
    totalTime: number;
    joinedAt: number;
    answerCount?: number;
    isHost?: boolean;
}

export interface LiveAnswer {
    uid: string;
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeTaken: number;
    points: number;
    answeredAt: number;
}

export const liveRoomRef = (roomId: string) => ref(realtimeDb, `liveRooms/${roomId}`);
export const liveStateRef = (roomId: string) => ref(realtimeDb, `liveRooms/${roomId}/state`);
export const livePlayersRef = (roomId: string) => ref(realtimeDb, `liveRooms/${roomId}/players`);
export const livePlayerRef = (roomId: string, uid: string) => ref(realtimeDb, `liveRooms/${roomId}/players/${uid}`);
export const liveQuestionAnswersRef = (roomId: string, questionId: string) => ref(realtimeDb, `liveRooms/${roomId}/answers/${questionId}`);
export const livePlayerAnswerRef = (roomId: string, questionId: string, uid: string) => ref(realtimeDb, `liveRooms/${roomId}/answers/${questionId}/${uid}`);

export function subscribeValue<T>(
    targetRef: DatabaseReference,
    onData: (value: T | null, snapshot: DataSnapshot) => void
) {
    const unsubscribe = onValue(targetRef, (snapshot) => {
        onData(snapshot.exists() ? snapshot.val() as T : null, snapshot);
    });

    return unsubscribe;
}

export function subscribeLivePlayers(roomId: string, onData: (players: LivePlayer[]) => void) {
    return onValue(livePlayersRef(roomId), (snapshot) => {
        const value = snapshot.val() || {};
        const players = Object.entries(value).map(([id, data]) => ({
            id,
            ...(data as Omit<LivePlayer, "id">),
            score: (data as LivePlayer).score || 0,
            totalTime: (data as LivePlayer).totalTime || 0,
            answerCount: (data as LivePlayer).answerCount || 0,
        }));
        onData(players);
    });
}

export function subscribeQuestionAnswers(
    roomId: string,
    questionId: string,
    onData: (answers: Record<string, LiveAnswer>) => void
) {
    return onValue(liveQuestionAnswersRef(roomId, questionId), (snapshot) => {
        onData(snapshot.val() || {});
    });
}

export async function createLiveRoom(roomId: string, state: LiveRoomState) {
    await set(liveRoomRef(roomId), {
        state,
        players: {},
        answers: {},
    });
}

export async function updateLiveState(roomId: string, updates: Partial<LiveRoomState>) {
    await update(liveStateRef(roomId), updates);
}

export async function joinLiveRoom(roomId: string, uid: string, player: Omit<LivePlayer, "id">) {
    await set(livePlayerRef(roomId, uid), player);
}

export async function getLivePlayer(roomId: string, uid: string) {
    const snapshot = await get(livePlayerRef(roomId, uid));
    return snapshot.exists() ? snapshot.val() as Omit<LivePlayer, "id"> : null;
}

export async function getLivePlayers(roomId: string) {
    const snapshot = await get(livePlayersRef(roomId));
    const value = snapshot.val() || {};
    return Object.entries(value).map(([id, data]) => ({
        id,
        ...(data as Omit<LivePlayer, "id">),
        score: (data as LivePlayer).score || 0,
        totalTime: (data as LivePlayer).totalTime || 0,
        answerCount: (data as LivePlayer).answerCount || 0,
    }));
}

export async function getLiveRoomState(roomId: string) {
    const snapshot = await get(liveStateRef(roomId));
    return snapshot.exists() ? snapshot.val() as LiveRoomState : null;
}

export async function submitLiveAnswer(roomId: string, uid: string, answer: LiveAnswer) {
    const answerPath = `liveRooms/${roomId}/answers/${answer.questionId}/${uid}`;
    const playerPath = `liveRooms/${roomId}/players/${uid}`;
    await update(ref(realtimeDb), {
        [answerPath]: answer,
        [`${playerPath}/score`]: increment(answer.points),
        [`${playerPath}/totalTime`]: increment(answer.timeTaken),
        [`${playerPath}/answerCount`]: increment(1),
    });
}

export async function getLiveAnswersForPlayer(roomId: string, uid: string, questionIds: string[]) {
    const root = ref(realtimeDb);
    const entries = await Promise.all(questionIds.map(async (questionId) => {
        const snapshot = await get(child(root, `liveRooms/${roomId}/answers/${questionId}/${uid}`));
        return [questionId, snapshot.exists() ? snapshot.val() as LiveAnswer : null] as const;
    }));

    return Object.fromEntries(entries.filter(([, answer]) => answer !== null));
}

export async function resetLivePlayers(roomId: string) {
    const players = await getLivePlayers(roomId);
    const updates: Record<string, unknown> = {};
    players.forEach((player) => {
        updates[`liveRooms/${roomId}/players/${player.id}/score`] = 0;
        updates[`liveRooms/${roomId}/players/${player.id}/totalTime`] = 0;
        updates[`liveRooms/${roomId}/players/${player.id}/answerCount`] = 0;
    });
    updates[`liveRooms/${roomId}/answers`] = null;
    await update(ref(realtimeDb), updates);
}

export async function deleteLiveRoom(roomId: string) {
    await remove(liveRoomRef(roomId));
}

export function unsubscribeRef(targetRef: DatabaseReference) {
    off(targetRef);
}
