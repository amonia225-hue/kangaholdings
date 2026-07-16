import { Head, Link, router, useForm } from '@inertiajs/react';
import KangaLayout from '@/kanga/KangaLayout';
import Placeholder from '@/kanga/Placeholder';
import { KH, maxW } from '@/kanga/theme';

type Item = { id: number; name: string; unit: string | null; image: string | null; qty: number };

export default function Reservation({ items, isAuthed }: { items: Item[]; isAuthed: boolean }) {
    const { data, setData, post, processing } = useForm({
        date: '',
        mode: 'Retrait à la ferme',
        note: '',
    });

    const inc = (id: number) => router.patch(`/panier/${id}`, { delta: 1 }, { preserveScroll: true });
    const dec = (id: number) => router.patch(`/panier/${id}`, { delta: -1 }, { preserveScroll: true });
    const remove = (id: number) => router.delete(`/panier/${id}`, { preserveScroll: true });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reservation');
    };

    const qtyBtn = { width: 30, height: 30, border: 'none', background: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: 18, color: '#33402c' } as const;
    const label = { display: 'block', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(34,39,31,.6)', marginBottom: 6 } as const;
    const field = { width: '100%', padding: '12px 13px', border: '1px solid rgba(34,39,31,.2)', borderRadius: 9, fontSize: 15, marginBottom: 16, background: KH.field } as const;

    return (
        <KangaLayout>
            <Head title="Réservation — Kanga Holdings" />
            <div className="kh-fade" style={{ maxWidth: 1080, margin: '0 auto', padding: '52px 28px 90px' }}>
                <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 12 }}>Réservation</span>
                <h1 className="kh-serif kh-h1" style={{ fontWeight: 500, fontSize: 48, margin: '0 0 8px' }}>Votre demande de réservation</h1>
                <p style={{ fontSize: 16, color: 'rgba(34,39,31,.7)', margin: '0 0 34px' }}>Sans prix affiché — nous vous adressons un devis confirmé sous 24h ouvrées.</p>

                {items.length > 0 ? (
                    <div className="kh-reserve-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 30, alignItems: 'start' }}>
                        {/* items */}
                        <div style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden' }}>
                            {items.map((i) => (
                                <div key={i.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid rgba(34,39,31,.08)' }}>
                                    <div style={{ width: 74, height: 74, borderRadius: 10, overflow: 'hidden', flex: 'none', background: KH.sand }}>
                                        <Placeholder src={i.image} label="" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="kh-serif" style={{ fontSize: 21, fontWeight: 600 }}>{i.name}</div>
                                        <div style={{ fontSize: 13, color: 'rgba(34,39,31,.6)' }}>{i.unit}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(34,39,31,.18)', borderRadius: 999, padding: 3 }}>
                                        <button onClick={() => dec(i.id)} style={qtyBtn} aria-label="Diminuer">−</button>
                                        <span style={{ minWidth: 28, textAlign: 'center', fontSize: 15 }}>{i.qty}</span>
                                        <button onClick={() => inc(i.id)} style={qtyBtn} aria-label="Augmenter">+</button>
                                    </div>
                                    <button onClick={() => remove(i.id)} style={{ background: 'none', border: 'none', color: 'rgba(34,39,31,.4)', cursor: 'pointer', fontSize: 13, padding: 6 }}>Retirer</button>
                                </div>
                            ))}
                            <div style={{ padding: '18px 20px' }}>
                                <Link href="/produits" style={{ color: KH.gold, fontSize: 14 }}>＋ Ajouter d'autres produits</Link>
                            </div>
                        </div>

                        {/* form */}
                        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: 24 }}>
                            <h3 className="kh-serif" style={{ fontWeight: 600, fontSize: 24, margin: '0 0 18px' }}>Retrait &amp; livraison</h3>
                            <label style={label}>Date souhaitée</label>
                            <input name="date" type="date" required value={data.date} onChange={(e) => setData('date', e.target.value)} style={field} />
                            <label style={label}>Mode</label>
                            <select name="mode" value={data.mode} onChange={(e) => setData('mode', e.target.value)} style={field}>
                                <option>Retrait à la ferme</option>
                                <option>Livraison (Deux-Sèvres)</option>
                                <option>Livraison réfrigérée (national)</option>
                            </select>
                            <label style={label}>Note pour l'éleveur</label>
                            <textarea name="note" rows={3} value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Découpe, conditionnement, fréquence…" style={{ ...field, marginBottom: 20, resize: 'vertical' }} />
                            <div style={{ background: KH.cream, borderRadius: 10, padding: '13px 15px', fontSize: 13, color: 'rgba(34,39,31,.7)', marginBottom: 18, lineHeight: 1.5 }}>
                                Devis confirmé sous 24h — aucun engagement tant que vous n'avez pas validé le prix proposé.
                            </div>
                            <button type="submit" disabled={processing} style={{ width: '100%', background: KH.gold, color: '#fff', border: 'none', padding: 15, borderRadius: 999, fontSize: 15, letterSpacing: '.04em', cursor: 'pointer', opacity: processing ? 0.7 : 1 }}>
                                {isAuthed ? 'Envoyer ma réservation' : 'Créer un compte & réserver'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ background: '#fff', border: '1px dashed rgba(34,39,31,.2)', borderRadius: 14, padding: '70px 30px', textAlign: 'center' }}>
                        <div className="kh-serif" style={{ fontSize: 30, color: '#33402c', marginBottom: 8 }}>Votre réservation est vide</div>
                        <p style={{ fontSize: 15, color: 'rgba(34,39,31,.6)', margin: '0 0 24px' }}>Parcourez le catalogue et ajoutez les lots qui vous intéressent.</p>
                        <Link href="/produits" style={{ display: 'inline-block', background: KH.green, color: KH.cream, padding: '14px 28px', borderRadius: 999, fontSize: 15 }}>Voir le catalogue</Link>
                    </div>
                )}
            </div>
        </KangaLayout>
    );
}
