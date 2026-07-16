// Kanga Holdings palette — mirrors the approved mockup exactly.
export const KH = {
    cream: '#f4efe4',
    cream2: '#eae1cf',
    sand: '#dfd6c2',
    field: '#faf7f0',
    ink: '#22271f',
    green: '#333f2c',
    greenDeep: '#1f2a1b',
    gold: '#b8862b',
    goldDark: '#8a6417',
    goldLight: '#e0b24e',
    goldBtn: '#c2922b',
    paper: '#f7f2e6',
} as const;

export const serif = "'DM Serif Display', Georgia, serif";
export const maxW = 1220;

/** Format an amount in FCFA (no decimals, thin-space thousands). */
export function formatF(amount: number | string | null | undefined): string {
    const n = Number(amount ?? 0);
    return Math.round(n).toLocaleString('fr-FR') + ' F';
}
