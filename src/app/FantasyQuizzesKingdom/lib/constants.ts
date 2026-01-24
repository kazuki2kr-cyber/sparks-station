import { Sparkles, BookOpen, Scroll, Gamepad2, PartyPopper } from "lucide-react";

export type QuizCategory = {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
};

export const QUIZ_CATEGORIES: QuizCategory[] = [
    {
        id: "general",
        name: "一般常識",
        description: "幅広いジャンルからランダムに出題",
        icon: Scroll,
        color: "text-amber-400"
    },
    {
        id: "party",
        name: "パーティ",
        description: "忘年会・新年会・歓迎会に！",
        icon: PartyPopper,
        color: "text-pink-400"
    },
    {
        id: "anime-game",
        name: "アニメ・ゲーム",
        description: "サブカル知識を競う",
        icon: Gamepad2,
        color: "text-purple-400"
    },
    {
        id: "study",
        name: "歴史・学習",
        description: "授業や勉強会に最適",
        icon: BookOpen,
        color: "text-blue-400"
    },
    {
        id: "all",
        name: "すべて",
        description: "全カテゴリからランダム",
        icon: Sparkles,
        color: "text-white"
    }
];
