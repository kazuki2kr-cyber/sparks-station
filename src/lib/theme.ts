export type Theme = {
    primary: string; // Text color (e.g., text-emerald-400)
    bg: string; // Background pill (e.g., bg-emerald-500/10)
    border: string; // Border color (e.g., border-emerald-500/20)
    hoverBorder: string; // Hover border (e.g., hover:border-emerald-500/50)
    hoverShadow: string; // Hover shadow
    groupHoverText: string; // Group hover text
    prose: string; // Prose class (e.g., prose-emerald)
    heading: string; // Heading color for prose
    codeText: string;
    codeBg: string;
    metricLabel: string; // For the metrics card
    metricValue: string;
    gradient: string; // Background gradient for the card
};

export const THEMES: Record<string, Theme> = {
    emerald: {
        primary: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        hoverBorder: 'hover:border-emerald-500/50',
        hoverShadow: 'hover:shadow-emerald-500/10',
        groupHoverText: 'group-hover:text-emerald-400',
        prose: 'prose-emerald',
        heading: 'prose-h3:text-emerald-400',
        codeText: 'text-emerald-300',
        codeBg: 'bg-emerald-950/40',
        metricLabel: 'text-emerald-400',
        metricValue: 'text-emerald-400',
        gradient: 'from-emerald-600 via-teal-600 to-green-600',
    },
    purple: {
        primary: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        hoverBorder: 'hover:border-purple-500/50',
        hoverShadow: 'hover:shadow-purple-500/10',
        groupHoverText: 'group-hover:text-purple-400',
        prose: 'prose-purple',
        heading: 'prose-h3:text-purple-400',
        codeText: 'text-purple-300',
        codeBg: 'bg-purple-950/40',
        metricLabel: 'text-purple-400',
        metricValue: 'text-purple-400',
        gradient: 'from-purple-600 via-indigo-600 to-violet-600',
    },
    blue: {
        primary: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        hoverBorder: 'hover:border-cyan-500/50',
        hoverShadow: 'hover:shadow-cyan-500/10',
        groupHoverText: 'group-hover:text-cyan-400',
        prose: 'prose-cyan',
        heading: 'prose-h3:text-cyan-400',
        codeText: 'text-cyan-300',
        codeBg: 'bg-cyan-950/40',
        metricLabel: 'text-cyan-400',
        metricValue: 'text-cyan-400',
        gradient: 'from-blue-600 via-cyan-600 to-sky-600',
    },
    rose: {
        primary: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        hoverBorder: 'hover:border-rose-500/50',
        hoverShadow: 'hover:shadow-rose-500/10',
        groupHoverText: 'group-hover:text-rose-400',
        prose: 'prose-rose',
        heading: 'prose-h3:text-rose-400',
        codeText: 'text-rose-300',
        codeBg: 'bg-rose-950/40',
        metricLabel: 'text-rose-400',
        metricValue: 'text-rose-400',
        gradient: 'from-rose-600 via-pink-600 to-red-600',
    },
};

export function getThemeForTag(tag: string): Theme {
    const lowerTag = tag.toLowerCase();

    // Failure Case tags trigger Rose theme
    if (lowerTag.startsWith('failurecase')) {
        return THEMES.rose;
    }

    // Concept / Thought related tags trigger Purple theme
    if (['narrativeengineering', 'thought', 'concept', 'singularity', 'philosophy'].some(t => lowerTag.startsWith(t))) {
        return THEMES.purple;
    }

    // AI / Tech related tags trigger Blue theme
    if (['ai agent', 'ai', 'llm', 'machine learning', 'tech', 'agent'].some(t => lowerTag.includes(t))) {
        return THEMES.blue;
    }

    // Default to Emerald (SaaS, Business, etc.)
    return THEMES.emerald;
}
