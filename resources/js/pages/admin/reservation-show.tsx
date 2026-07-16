import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminShell, { STATUS_STYLE } from '@/kanga/AdminShell';
import { KH } from '@/kanga/theme';

type Item = { name: string; unit: string | null; qty: number };
type Reservation = {
    id: number;
    ref: string;
    status: string;
    status_label: string;
    mode: string | null;
    date: string | null;
    created: string | null;
    note: string | null;
    quote_amount: string | null;
    quote_message: string | null;
    items: Item[];
    client: {
        etablissement: string | null;
        contact: string | null;
        email: string | null;
        telephone: string | null;
        ville: string | null;
        adresse: string | null;
        siret: string | null;
    };
};

export default function ReservationShow({ reservation, statuses }: { reservation: Reservation; statuses: Record<string, string> }) {
    const quote = useForm({
        quote_amount: reservation.quote_amount ?? '',
        quote_message: reservation.quote_message ?? '',
    });

    const st = STATUS_STYLE[reservation.status] ?? { bg: '#eee', color: '#333' };
    const card = { background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: 24 } as const;
    const label = { display: 'block', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(34,39,31,.6)', margin: '0 0 5px' } as const;
    const input = { width: '100%', padding: '12px 13px', border: '1px solid rgba(34,39,31,.2)', borderRadius: 9, fontSize: 15, background: KH.field, marginBottom: 14 } as const;

    const submitQuote = (e: React.FormEvent) => {
        e.preventDefault();
        quote.post(`/admin/reservations/${reservation.id}/devis`, { preserveScroll: true });
    };

    const setStatus = (status: string) => router.post(`/admin/reservations/${reservation.id}/statut`, { status }, { preserveScroll: true });

    const clientRows = [
        ['Contact', reservation.client.contact],
        ['Email', reservation.client.email],
        ['Téléphone', reservation.client.telephone],
        ['Ville', reservation.client.ville],
        ['Adresse', reservation.client.adresse],
        ['SIRET', reservation.client.siret],
    ] as const;

    return (
        <AdminShell title={`Réservation ${reservation.ref}`}>
            <Head title={`Admin · ${reservation.ref}`} />
            <Link href="/admin/reservations" style={{ color: KH.gold, fontSize: 14, display: 'inline-block', marginBottom: 20 }}>← Toutes les réservations</Link>

            <div className="kh-reserve-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 20 }}>
                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 className="kh-serif" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Détail de la demande</h3>
                            <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color }}>{reservation.status_label}</span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {reservation.items.map((i, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(34,39,31,.08)' }}>
                                        <td style={{ padding: '10px 0', fontWeight: 600 }}>{i.name}</td>
                                        <td style={{ padding: '10px 0', color: 'rgba(34,39,31,.6)', fontSize: 14 }}>{i.unit}</td>
                                        <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>×{i.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(34,39,31,.7)' }}>
                            <div><strong>Mode :</strong> {reservation.mode ?? '—'}</div>
                            <div><strong>Date souhaitée :</strong> {reservation.date ?? 'à préciser'}</div>
                            <div><strong>Reçue le :</strong> {reservation.created}</div>
                            {reservation.note && <div style={{ marginTop: 8 }}><strong>Note :</strong> {reservation.note}</div>}
                        </div>
                    </div>

                    <form onSubmit={submitQuote} style={card}>
                        <h3 className="kh-serif" style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px' }}>Établir le devis</h3>
                        <label style={label}>Montant du devis (F CFA)</label>
                        <input type="number" step="500" min="0" required value={quote.data.quote_amount} onChange={(e) => quote.setData('quote_amount', e.target.value)} style={input} placeholder="Ex. 85 000" />
                        {quote.errors.quote_amount && <div style={{ color: '#b3261e', fontSize: 13, marginTop: -8, marginBottom: 12 }}>{quote.errors.quote_amount}</div>}
                        <label style={label}>Message au client</label>
                        <textarea rows={3} value={quote.data.quote_message} onChange={(e) => quote.setData('quote_message', e.target.value)} style={{ ...input, resize: 'vertical' }} placeholder="Conditions, disponibilité, précisions de découpe…" />
                        <button type="submit" disabled={quote.processing} style={{ background: KH.gold, color: '#fff', border: 'none', padding: '13px 26px', borderRadius: 999, fontSize: 15, cursor: 'pointer', opacity: quote.processing ? 0.7 : 1 }}>Envoyer le devis</button>
                    </form>
                </div>

                <div style={{ display: 'grid', gap: 20 }}>
                    <div style={{ ...card, background: KH.green, color: KH.cream }}>
                        <h3 className="kh-serif" style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px' }}>{reservation.client.etablissement}</h3>
                        <div style={{ fontSize: 13, color: 'rgba(244,239,228,.7)', marginBottom: 18 }}>Client professionnel</div>
                        <dl style={{ margin: 0, display: 'grid', gap: 12, fontSize: 14 }}>
                            {clientRows.filter(([, v]) => v).map(([k, v]) => (
                                <div key={k}>
                                    <dt style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(244,239,228,.55)', marginBottom: 2 }}>{k}</dt>
                                    <dd style={{ margin: 0 }}>{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div style={card}>
                        <h3 className="kh-serif" style={{ fontSize: 20, fontWeight: 600, margin: '0 0 14px' }}>Changer le statut</h3>
                        <div style={{ display: 'grid', gap: 8 }}>
                            {Object.entries(statuses).map(([key, lbl]) => (
                                <button
                                    key={key}
                                    onClick={() => setStatus(key)}
                                    disabled={key === reservation.status}
                                    style={{
                                        textAlign: 'left',
                                        padding: '10px 14px',
                                        borderRadius: 10,
                                        border: '1px solid rgba(34,39,31,.15)',
                                        background: key === reservation.status ? KH.cream2 : '#fff',
                                        cursor: key === reservation.status ? 'default' : 'pointer',
                                        fontSize: 14,
                                        fontWeight: key === reservation.status ? 600 : 400,
                                    }}
                                >
                                    {lbl}{key === reservation.status ? ' ✓' : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
