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
    },
};

export function getThemeForTag(tag: string): Theme {
    const lowerTag = tag.toLowerCase();
    // Concept / Thought related tags trigger Purple theme
    if (['narrativeengineering', 'thought', 'concept', 'singularity', 'philosophy'].includes(lowerTag)) {
        return THEMES.purple;
    }
    // Default to Emerald
    return THEMES.emerald;
}
