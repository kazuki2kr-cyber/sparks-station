import { Sparkles, BookOpen, Scroll, Gamepad2, PartyPopper, Box, Flag, Trophy, Snowflake, Globe } from "lucide-react";

export type QuizCategory = {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
};

export const QUIZ_CATEGORIES: QuizCategory[] = [
    {
        id: "world_master",
        name: "World Master",
        description: "国旗・人口・面積クイズ",
        icon: Globe,
        color: "text-emerald-400"
    },
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
        description: "歴史の知識を試す",
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
        name: "Formula 1",
        description: "F1の世界の知識で競う",
        icon: Flag, // Using Flag for racing
        color: "text-red-400"
    },
    {
        id: "keiba",
        name: "競馬",
        description: "G1レースや名馬の歴史",
        icon: Trophy,
        color: "text-amber-500"
    },
    {
        id: "winter_olympics",
        name: "冬季五輪",
        description: "雪と氷の祭典の知識",
        icon: Snowflake,
        color: "text-cyan-400"
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
