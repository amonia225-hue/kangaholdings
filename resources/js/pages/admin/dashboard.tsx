import { Head, Link } from '@inertiajs/react';
import AdminShell, { STATUS_STYLE } from '@/kanga/AdminShell';
import { formatF, KH } from '@/kanga/theme';

type Kpis = {
    ca_total: number;
    ca_month: number;
    reservations: number;
    pending: number;
    confirmed: number;
    clients: number;
    products: number;
    points: number;
};
type Month = { label: string; value: number };
type Top = { name: string; total: number };
type Recent = { id: number; ref: string; etablissement: string | null; status: string; status_label: string; quote_amount: string | null; created: string | null };

function RevenueChart({ data }: { data: Month[] }) {
    const W = 640;
    const H = 220;
    const pad = { l: 12, r: 12, t: 16, b: 30 };
    const max = Math.max(1, ...data.map((d) => d.value));
    const n = data.length;
    const bw = (W - pad.l - pad.r) / n;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Chiffre d'affaires mensuel" style={{ display: 'block' }}>
            {[0.25, 0.5, 0.75, 1].map((f) => (
                <line key={f} x1={pad.l} x2={W - pad.r} y1={pad.t + (H - pad.t - pad.b) * (1 - f)} y2={pad.t + (H - pad.t - pad.b) * (1 - f)} stroke="rgba(34,39,31,.08)" />
            ))}
            {data.map((d, i) => {
                const h = (d.value / max) * (H - pad.t - pad.b);
                const x = pad.l + i * bw + bw * 0.2;
                const w = bw * 0.6;
                const y = H - pad.b - h;
                return (
                    <g key={d.label}>
                        <rect x={x} y={y} width={w} height={Math.max(h, 1)} rx={5} fill={i === n - 1 ? KH.gold : KH.green} />
                        {d.value > 0 && (
                            <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="rgba(34,39,31,.6)">
                                {Math.round(d.value / 1000)}k
                            </text>
                        )}
                        <text x={x + w / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="rgba(34,39,31,.55)" style={{ textTransform: 'capitalize' }}>
                            {d.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function AdminDashboard({ kpis, monthly, topProducts, recent }: { kpis: Kpis; monthly: Month[]; topProducts: Top[]; recent: Recent[] }) {
    const card = { background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 16, padding: 24 } as const;

    const kpiCards = [
        { label: 'CA total (devis confirmés)', value: formatF(kpis.ca_total), big: true, accent: KH.green },
        { label: 'CA du mois', value: formatF(kpis.ca_month), accent: KH.gold },
        { label: 'Points fidélité distribués', value: kpis.points.toLocaleString('fr-FR'), accent: KH.gold },
    ];
    const mini = [
        { label: 'Réservations', value: kpis.reservations },
        { label: 'En cours', value: kpis.pending },
        { label: 'Confirmées', value: kpis.confirmed },
        { label: 'Clients pros', value: kpis.clients },
        { label: 'Produits', value: kpis.products },
    ];
    const maxTop = Math.max(1, ...topProducts.map((t) => t.total));

    return (
        <AdminShell title="Tableau de bord">
            <Head title="Admin · Tableau de bord — Kanga Holdings" />

            {/* quick actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
                <Link href="/admin/produits" style={{ background: KH.gold, color: '#fff', padding: '11px 20px', borderRadius: 999, fontSize: 14 }}>+ Publier un produit</Link>
                <Link href="/admin/reservations" data={{ statut: 'en_cours' }} style={{ background: KH.green, color: KH.cream, padding: '11px 20px', borderRadius: 999, fontSize: 14 }}>Commandes en cours</Link>
                <Link href="/admin/clients" style={{ background: '#fff', color: KH.ink, border: '1px solid rgba(34,39,31,.18)', padding: '11px 20px', borderRadius: 999, fontSize: 14 }}>Liste des clients</Link>
                <Link href="/admin/categories" style={{ background: '#fff', color: KH.ink, border: '1px solid rgba(34,39,31,.18)', padding: '11px 20px', borderRadius: 999, fontSize: 14 }}>Catégories</Link>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginBottom: 16 }} className="kh-trust-grid">
                {kpiCards.map((k) => (
                    <div key={k.label} style={{ ...card, padding: '22px 24px' }}>
                        <div style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(34,39,31,.55)' }}>{k.label}</div>
                        <div className="kh-serif" style={{ fontSize: k.big ? 40 : 32, color: k.accent, marginTop: 8, lineHeight: 1 }}>{k.value}</div>
                    </div>
                ))}
            </div>

            {/* mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 26 }} className="kh-trust-grid">
                {mini.map((m) => (
                    <div key={m.label} style={{ background: KH.cream2, borderRadius: 12, padding: '14px 16px' }}>
                        <div className="kh-serif" style={{ fontSize: 26, color: KH.green, lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(34,39,31,.55)', marginTop: 4 }}>{m.label}</div>
                    </div>
                ))}
            </div>

            {/* chart */}
            <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <h2 className="kh-serif" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Chiffre d'affaires · 6 derniers mois</h2>
                    <span style={{ fontSize: 13, color: 'rgba(34,39,31,.55)' }}>Devis confirmés</span>
                </div>
                <RevenueChart data={monthly} />
            </div>

            {/* two columns */}
            <div className="kh-reserve-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'start' }}>
                <div style={card}>
                    <h2 className="kh-serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 16px' }}>Produits les plus demandés</h2>
                    {topProducts.length === 0 ? (
                        <p style={{ color: 'rgba(34,39,31,.55)', fontSize: 14 }}>Pas encore de données.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {topProducts.map((t) => (
                                <div key={t.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                                        <span>{t.name}</span>
                                        <span style={{ color: 'rgba(34,39,31,.6)' }}>{t.total}</span>
                                    </div>
                                    <div style={{ height: 8, background: KH.cream2, borderRadius: 999 }}>
                                        <div style={{ height: 8, width: `${(t.total / maxTop) * 100}%`, background: KH.gold, borderRadius: 999 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 className="kh-serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Dernières demandes</h2>
                        <Link href="/admin/reservations" style={{ color: KH.gold, fontSize: 13 }}>Tout voir →</Link>
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                        {recent.map((r) => {
                            const st = STATUS_STYLE[r.status] ?? { bg: '#eee', color: '#333' };
                            return (
                                <Link key={r.id} href={`/admin/reservations/${r.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(34,39,31,.08)', color: KH.ink }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.ref} · {r.etablissement}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(34,39,31,.5)' }}>{r.created}{r.quote_amount ? ` · ${formatF(r.quote_amount)}` : ''}</div>
                                    </div>
                                    <span style={{ flex: 'none', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, background: st.bg, color: st.color }}>{r.status_label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
