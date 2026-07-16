import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import KangaLayout from './KangaLayout';
import { KH, maxW } from './theme';

export default function AdminShell({ title, children }: { title: string; children: ReactNode }) {
    const url = usePage().url.split('?')[0];
    const tabs = [
        { label: 'Tableau de bord', href: '/admin' },
        { label: 'Commandes', href: '/admin/reservations' },
        { label: 'Clients', href: '/admin/clients' },
        { label: 'Produits', href: '/admin/produits' },
        { label: 'Catégories', href: '/admin/categories' },
    ];
    const active = (href: string) => (href === '/admin' ? url === '/admin' : url.startsWith(href));

    return (
        <KangaLayout>
            <div className="kh-admin-grid" style={{ maxWidth: maxW, margin: '0 auto', padding: '30px 28px 80px', display: 'grid', gridTemplateColumns: '244px 1fr', gap: 30, alignItems: 'start' }}>
                {/* vertical sidebar menu */}
                <aside className="kh-admin-side" style={{ position: 'sticky', top: 88 }}>
                    <div style={{ background: KH.green, color: KH.cream, borderRadius: 16, padding: 18 }}>
                        <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(244,239,228,.55)', padding: '4px 12px 12px' }}>Administration</div>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {tabs.map((t) => {
                                const on = active(t.href);
                                return (
                                    <Link
                                        key={t.href}
                                        href={t.href}
                                        style={{
                                            display: 'block',
                                            padding: '11px 16px',
                                            borderRadius: 10,
                                            fontSize: 14.5,
                                            letterSpacing: '.01em',
                                            color: on ? KH.green : 'rgba(244,239,228,.82)',
                                            background: on ? KH.cream : 'transparent',
                                            fontWeight: on ? 600 : 400,
                                            borderLeft: on ? `3px solid ${KH.gold}` : '3px solid transparent',
                                        }}
                                    >
                                        {t.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* content */}
                <div className="kh-fade" style={{ minWidth: 0 }}>
                    <div style={{ marginBottom: 24 }}>
                        <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 8 }}>Espace admin</span>
                        <h1 className="kh-serif" style={{ fontSize: 34, fontWeight: 600, margin: 0, color: KH.ink }}>{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </KangaLayout>
    );
}

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    en_attente_devis: { bg: '#f3e2d2', color: KH.gold },
    devis_envoye: { bg: '#e7ddf0', color: '#5b4a86' },
    confirmee: { bg: '#e2ead9', color: '#33402c' },
    refusee: { bg: '#f0dada', color: '#a33' },
};
