import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getAccentColor(tag: string): { primary: string; secondary: string } {
    const lower = tag.toLowerCase();
    if (lower.startsWith('failurecase')) return { primary: '#f43f5e', secondary: '#e11d48' };
    if (['narrativeengineering', 'thought', 'concept', 'philosophy'].some(t => lower.startsWith(t))) {
        return { primary: '#a855f7', secondary: '#9333ea' };
    }
    if (['ai', 'llm'].some(t => lower.startsWith(t))) return { primary: '#06b6d4', secondary: '#0891b2' };
    return { primary: '#10b981', secondary: '#059669' };
}

function getCategoryLabel(tag: string): string {
    const lower = tag.toLowerCase();
    if (lower.startsWith('failurecase')) return 'Failure Case';
    if (['narrativeengineering', 'thought', 'concept', 'philosophy'].some(t => lower.startsWith(t))) return 'Philosophy';
    return 'Success Case';
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Sparks Station';
    const mrr = searchParams.get('mrr') || '';
    const exitPrice = searchParams.get('exit') || '';
    const tag = searchParams.get('tag') || 'SuccessCase';

    const { primary, secondary } = getAccentColor(tag);
    const categoryLabel = getCategoryLabel(tag);

    // Truncate title for display
    const displayTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '1200px',
                    height: '630px',
                    backgroundColor: '#0a0a0a',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top accent gradient bar */}
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(to right, ${primary}, ${secondary})`,
                }} />

                {/* Background radial glow */}
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '-200px',
                    right: '-200px',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${primary}20 0%, transparent 70%)`,
                }} />

                {/* Header row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '40px 60px 0',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <div style={{
                            display: 'flex',
                            width: '8px',
                            height: '28px',
                            backgroundColor: primary,
                            borderRadius: '4px',
                        }} />
                        <span style={{
                            color: '#ffffff',
                            fontSize: '22px',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}>Sparks Station</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        backgroundColor: `${primary}20`,
                        border: `1px solid ${primary}40`,
                        borderRadius: '20px',
                        padding: '6px 16px',
                        color: primary,
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                    }}>
                        {categoryLabel}
                    </div>
                </div>

                {/* Main title */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    padding: '30px 60px',
                }}>
                    <h1 style={{
                        color: '#f5f5f5',
                        fontSize: displayTitle.length > 40 ? '36px' : '44px',
                        fontWeight: 800,
                        lineHeight: 1.4,
                        margin: 0,
                        letterSpacing: '-0.01em',
                    }}>
                        {displayTitle}
                    </h1>
                </div>

                {/* Footer row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '0 60px 44px',
                }}>
                    {/* MRR / Exit badges */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {mrr && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#171717',
                                border: `1px solid ${primary}30`,
                                borderRadius: '12px',
                                padding: '10px 20px',
                            }}>
                                <span style={{ color: '#737373', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>MRR</span>
                                <span style={{ color: primary, fontSize: '20px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{mrr}</span>
                            </div>
                        )}
                        {exitPrice && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#171717',
                                border: '1px solid #f59e0b30',
                                borderRadius: '12px',
                                padding: '10px 20px',
                            }}>
                                <span style={{ color: '#737373', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Exit</span>
                                <span style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 700 }}>{exitPrice}</span>
                            </div>
                        )}
                    </div>

                    {/* Domain */}
                    <span style={{
                        color: '#525252',
                        fontSize: '16px',
                        letterSpacing: '0.05em',
                    }}>
                        sparks-station.com
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
