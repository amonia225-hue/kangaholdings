import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { KH, maxW, serif } from './theme';

/**
 * Split-screen auth shell from the mockup: ambiance panel on the left,
 * a signup/login tab toggle + form on the right.
 */
export default function AuthShell({ mode, children }: { mode: 'login' | 'register'; children: ReactNode }) {
    const tabBtn = (active: boolean) => ({
        background: active ? '#fff' : 'transparent',
        color: KH.ink,
        border: 'none',
        padding: '9px 18px',
        borderRadius: 999,
        fontSize: 14,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
        fontWeight: active ? 500 : 400,
        textDecoration: 'none',
        display: 'inline-block',
    });

    return (
        <div className="kh" style={{ minHeight: '100vh', background: KH.cream, padding: '40px 20px', display: 'flex', alignItems: 'center' }}>
            <div className="kh-fade kh-auth-grid" style={{ maxWidth: maxW, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(31,42,27,.12)' }}>
                {/* ambiance panel */}
                <div className="kh-hide-md" style={{ position: 'relative', background: KH.greenDeep, minHeight: 560 }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, background: "url('/img/veg-garden.jpg') center/cover" }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(31,42,27,.6),rgba(31,42,27,.9))', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', padding: 48, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: KH.cream, boxSizing: 'border-box' }}>
                        <Link href="/" className="kh-serif" style={{ fontSize: 26, fontWeight: 600, color: KH.cream }}>Kanga Holdings</Link>
                        <div>
                            <h2 className="kh-serif" style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.1, margin: '0 0 14px' }}>Un compte pro,<br />un interlocuteur dédié</h2>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 15, color: 'rgba(244,239,228,.85)' }}>
                                <li>— Catalogue complet &amp; disponibilités en temps réel</li>
                                <li>— Réservation sans prix affiché, devis sous 24h</li>
                                <li>— Historique &amp; recommande en un clic</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* form panel */}
                <div style={{ background: '#fff', padding: '48px 44px' }}>
                    <div style={{ display: 'flex', gap: 6, background: KH.cream2, padding: 5, borderRadius: 999, marginBottom: 28, width: 'fit-content' }}>
                        <Link href="/register" style={tabBtn(mode === 'register')}>Créer un compte</Link>
                        <Link href="/login" style={tabBtn(mode === 'login')}>Se connecter</Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export const authStyles = {
    label: { display: 'block', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(34,39,31,.6)', margin: '0 0 5px' } as const,
    input: { width: '100%', padding: '12px 13px', border: '1px solid rgba(34,39,31,.2)', borderRadius: 9, fontSize: 15, background: KH.field, marginBottom: 2 } as const,
    submit: { width: '100%', background: KH.gold, color: '#fff', border: 'none', padding: 15, borderRadius: 999, fontSize: 15, letterSpacing: '.04em', cursor: 'pointer' } as const,
    title: { fontFamily: serif, fontWeight: 500, fontSize: 34, margin: '0 0 6px' } as const,
    sub: { fontSize: 14, color: 'rgba(34,39,31,.6)', margin: '0 0 24px' } as const,
    error: { color: '#b3261e', fontSize: 13, marginTop: 4 } as const,
};
