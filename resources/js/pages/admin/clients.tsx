import { Head } from '@inertiajs/react';
import AdminShell from '@/kanga/AdminShell';
import { formatF, KH } from '@/kanga/theme';

type Client = {
    id: number;
    etablissement: string;
    contact: string | null;
    email: string | null;
    telephone: string | null;
    ville: string | null;
    siret: string | null;
    points: number;
    reservations: number;
    pending: number;
    ca: number;
    joined: string | null;
};

export default function AdminClients({ clients }: { clients: Client[] }) {
    const totalCa = clients.reduce((s, c) => s + c.ca, 0);

    return (
        <AdminShell title="Clients professionnels">
            <Head title="Admin · Clients — Kanga Holdings" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }} className="kh-trust-grid">
                {[
                    { label: 'Clients pros', value: clients.length },
                    { label: 'CA cumulé', value: formatF(totalCa) },
                    { label: 'Commandes en cours', value: clients.reduce((s, c) => s + c.pending, 0) },
                ].map((k) => (
                    <div key={k.label} style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: '20px 22px' }}>
                        <div className="kh-serif" style={{ fontSize: 30, color: KH.green }}>{k.value}</div>
                        <div style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(34,39,31,.55)', marginTop: 4 }}>{k.label}</div>
                    </div>
                ))}
            </div>

            {clients.length === 0 ? (
                <div style={{ background: '#fff', border: '1px dashed rgba(34,39,31,.2)', borderRadius: 14, padding: 60, textAlign: 'center', color: 'rgba(34,39,31,.6)' }}>
                    Aucun client pour le moment.
                </div>
            ) : (
                <div style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden' }}>
                    {clients.map((c) => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderBottom: '1px solid rgba(34,39,31,.06)' }}>
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: KH.green, color: KH.cream, display: 'grid', placeItems: 'center', fontFamily: "'DM Serif Display',serif", fontSize: 20, flex: 'none' }}>
                                {(c.etablissement.trim().charAt(0) || 'K').toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="kh-serif" style={{ fontSize: 18, fontWeight: 600 }}>{c.etablissement}</div>
                                <div style={{ fontSize: 13, color: 'rgba(34,39,31,.55)', marginTop: 2 }}>
                                    {c.contact ? `${c.contact} · ` : ''}{c.ville || '—'}{c.joined ? ` · depuis ${c.joined}` : ''}
                                </div>
                            </div>
                            <div style={{ flex: '0 0 auto', textAlign: 'right', minWidth: 170 }}>
                                <div style={{ fontSize: 13, color: KH.ink }}>{c.email}</div>
                                <div style={{ fontSize: 13, color: 'rgba(34,39,31,.55)' }}>{c.telephone || '—'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
                                <span title="Chiffre d'affaires confirmé" style={{ fontSize: 13, background: '#e2ead9', color: '#33402c', padding: '6px 12px', borderRadius: 999 }}>{formatF(c.ca)}</span>
                                {c.pending > 0 && <span title="Commandes en cours" style={{ fontSize: 13, background: '#f3e2d2', color: KH.gold, padding: '6px 12px', borderRadius: 999 }}>{c.pending} en cours</span>}
                                <span title="Points fidélité" style={{ fontSize: 13, background: KH.cream2, color: '#33402c', padding: '6px 12px', borderRadius: 999 }}>{c.points} pt{c.points > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminShell>
    );
}
