import { Head, Link, router } from '@inertiajs/react';
import AdminShell, { STATUS_STYLE } from '@/kanga/AdminShell';
import { formatF, KH } from '@/kanga/theme';

type Item = { name: string; unit: string | null; qty: number };
type Row = {
    id: number;
    ref: string;
    status: string;
    status_label: string;
    etablissement: string | null;
    ville: string | null;
    mode: string | null;
    date: string | null;
    created: string | null;
    quote_amount: string | null;
    items: Item[];
};
type Stats = { total: number; en_cours: number; pending: number; quoted: number; confirmed: number };

export default function AdminReservations({ reservations, stats, filter }: { reservations: Row[]; stats: Stats; filter: string }) {
    const cards = [
        { label: 'Demandes totales', value: stats.total },
        { label: 'Commandes en cours', value: stats.en_cours, accent: KH.gold },
        { label: 'Devis envoyés', value: stats.quoted },
        { label: 'Confirmées', value: stats.confirmed },
    ];

    const filters = [
        { key: 'tous', label: 'Toutes' },
        { key: 'en_cours', label: 'En cours' },
        { key: 'en_attente_devis', label: 'À deviser' },
        { key: 'devis_envoye', label: 'Devis envoyé' },
        { key: 'confirmee', label: 'Confirmées' },
        { key: 'refusee', label: 'Refusées' },
    ];
    const go = (key: string) => router.get('/admin/reservations', key === 'tous' ? {} : { statut: key }, { preserveScroll: true, preserveState: true });

    return (
        <AdminShell title="Commandes & réservations">
            <Head title="Admin · Commandes — Kanga Holdings" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }} className="kh-trust-grid">
                {cards.map((c) => (
                    <div key={c.label} style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: '20px 22px' }}>
                        <div className="kh-serif" style={{ fontSize: 34, color: c.accent ?? KH.green }}>{c.value}</div>
                        <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(34,39,31,.55)', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
                {filters.map((f) => {
                    const active = filter === f.key;
                    return (
                        <button key={f.key} onClick={() => go(f.key)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13.5, cursor: 'pointer', border: `1px solid ${active ? KH.green : 'rgba(34,39,31,.18)'}`, background: active ? KH.green : '#fff', color: active ? KH.cream : '#33402c' }}>
                            {f.label}
                        </button>
                    );
                })}
            </div>

            {reservations.length === 0 ? (
                <div style={{ background: '#fff', border: '1px dashed rgba(34,39,31,.2)', borderRadius: 14, padding: '60px', textAlign: 'center', color: 'rgba(34,39,31,.6)' }}>
                    Aucune commande dans cette vue.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                    {reservations.map((r) => {
                        const st = STATUS_STYLE[r.status] ?? { bg: '#eee', color: '#333' };

                        return (
                            <Link key={r.id} href={`/admin/reservations/${r.id}`} className="kh-lift" style={{ display: 'block', background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: '20px 22px', color: KH.ink }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                                        <span className="kh-serif" style={{ fontSize: 20, fontWeight: 600 }}>{r.ref}</span>
                                        <span style={{ fontSize: 14, color: 'rgba(34,39,31,.7)' }}>{r.etablissement}{r.ville ? ` · ${r.ville}` : ''}</span>
                                    </div>
                                    <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color }}>{r.status_label}</span>
                                </div>
                                <div style={{ fontSize: 14, color: 'rgba(34,39,31,.7)', marginBottom: 6 }}>{r.items.map((i) => `${i.qty}× ${i.name}`).join(' · ')}</div>
                                <div style={{ fontSize: 13, color: 'rgba(34,39,31,.5)' }}>
                                    {(r.mode ?? 'Retrait à la ferme')} · {r.date ?? 'date à préciser'} · reçue le {r.created}
                                    {r.quote_amount && ` · devis ${formatF(r.quote_amount)}`}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </AdminShell>
    );
}
