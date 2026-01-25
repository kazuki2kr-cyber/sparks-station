import { Sparkles, BookOpen, Scroll, Gamepad2, PartyPopper, Box, Flag } from "lucide-react";

export type QuizCategory = {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
};

export const QUIZ_CATEGORIES: QuizCategory[] = [
    {
        id: "party",
        name: "パーティ",
        description: "みんなで盛り上がる！",
        icon: PartyPopper,
        color: "text-pink-400"
    },
    {
        id: "history",
        name: "歴史",
        description: "歴史のロマンに浸る",
        icon: BookOpen,
        color: "text-blue-400"
    },
    {
        id: "minecraft",
        name: "マインクラフト",
        description: "ブロックの世界の知識",
        icon: Box, // Using Box as cube
        color: "text-green-400"
    },
    {
        id: "f1",
        name: "F1",
        description: "最速の世界を知る",
        icon: Flag, // Using Flag for racing
        color: "text-red-400"
    },
    {
        id: "all",
        name: "すべて",
        description: "全カテゴリからランダム",
        icon: Sparkles,
        color: "text-white"
    }
];

export const ADMIN_WHITELIST = [
    "ichikawa.kazuki@shibaurafzk.com",
    "kazuki2kr@gmail.com"
];
