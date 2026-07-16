import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import KangaLayout from '@/kanga/KangaLayout';
import type { SharedProps } from '@/kanga/KangaLayout';
import * as push from '@/kanga/push';
import { formatF, KH, maxW, serif } from '@/kanga/theme';

type Reservation = {
    ref: string;
    status: string;
    status_label: string;
    summary: string;
    meta: string;
    quote_amount: string | null;
    quote_message: string | null;
};

type Loyalty = {
    points: number;
    rate: number;
    history: { points: number; reason: string; amount: string | null; date: string | null }[];
};

function NotificationsCard() {
    const { vapidPublicKey } = usePage<SharedProps>().props;
    const [state, setState] = useState<'loading' | 'on' | 'off' | 'denied' | 'unsupported'>('loading');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        (async () => {
            if (!push.pushSupported() || !vapidPublicKey) return setState('unsupported');
            if (push.permission() === 'denied') return setState('denied');
            setState((await push.isSubscribed()) ? 'on' : 'off');
        })();
    }, [vapidPublicKey]);

    const enable = async () => {
        setBusy(true);
        const res = await push.subscribe(vapidPublicKey ?? '');
        setBusy(false);
        setState(res === 'ok' ? 'on' : res === 'denied' ? 'denied' : 'off');
    };
    const disable = async () => {
        setBusy(true);
        await push.unsubscribe();
        setBusy(false);
        setState('off');
    };

    const wrap = { background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 16, padding: 22 } as const;
    const title = <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: KH.gold, marginBottom: 8 }}>Notifications</div>;

    if (state === 'unsupported') return null;

    return (
        <div style={wrap}>
            {title}
            <div style={{ fontSize: 14, color: 'rgba(34,39,31,.7)', lineHeight: 1.5, marginBottom: 14 }}>
                {state === 'on' ? 'Vous êtes alerté dès qu\'un devis est prêt ou qu\'une réservation est confirmée.'
                    : state === 'denied' ? 'Notifications bloquées dans le navigateur. Autorisez-les dans les réglages du site.'
                    : 'Recevez une alerte à l\'envoi de votre devis et à la confirmation.'}
            </div>
            {state === 'on' && <button onClick={disable} disabled={busy} style={{ background: 'none', border: '1px solid rgba(34,39,31,.22)', padding: '10px 18px', borderRadius: 999, fontSize: 14, cursor: 'pointer' }}>Désactiver</button>}
            {state === 'off' && <button onClick={enable} disabled={busy} style={{ background: KH.gold, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 14, cursor: 'pointer' }}>{busy ? 'Activation…' : 'Activer les notifications'}</button>}
            {state === 'loading' && <div style={{ fontSize: 13, color: 'rgba(34,39,31,.5)' }}>…</div>}
        </div>
    );
}

function LoyaltyCard({ loyalty }: { loyalty: Loyalty }) {
    return (
        <div style={{ background: 'linear-gradient(150deg,#b8862b,#8a6417)', color: '#fff', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)' }}>Fidélité Kanga Holdings</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '10px 0 4px' }}>
                <span style={{ fontFamily: serif, fontSize: 46, lineHeight: 1 }}>{loyalty.points}</span>
                <span style={{ fontSize: 15, opacity: 0.85 }}>point{loyalty.points > 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', marginBottom: loyalty.history.length ? 16 : 0 }}>
                1 point pour chaque {loyalty.rate.toLocaleString('fr-FR')} F de commande confirmée.
            </div>
            {loyalty.history.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,.25)', paddingTop: 14, display: 'grid', gap: 10 }}>
                    {loyalty.history.slice(0, 4).map((h, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontSize: 13 }}>
                            <span style={{ color: 'rgba(255,255,255,.9)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.reason}<span style={{ opacity: 0.7 }}>{h.date ? ` · ${h.date}` : ''}</span></span>
                            <span style={{ flex: 'none', fontWeight: 700 }}>+{h.points}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Compte({ reservations, loyalty }: { reservations: Reservation[]; loyalty: Loyalty }) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user!;
    const name = user.etablissement || 'Établissement';
    const initial = (name.trim().charAt(0) || 'K').toUpperCase();

    const rows = [
        { k: 'Contact', v: user.contact || '—' },
        { k: 'Email', v: user.email || '—' },
        { k: 'Téléphone', v: user.telephone || '—' },
        { k: 'Ville', v: user.ville || '—' },
    ];

    const isPending = (s: string) => s === 'en_attente_devis' || s === 'devis_envoye';
    const badge = (s: string) => ({
        fontSize: 11,
        letterSpacing: '.1em',
        textTransform: 'uppercase' as const,
        padding: '5px 11px',
        borderRadius: 999,
        ...(isPending(s) ? { background: '#f3e2d2', color: KH.gold } : { background: '#e2ead9', color: '#33402c' }),
    });

    return (
        <KangaLayout>
            <Head title="Mon espace — Kanga Holdings" />
            <div className="kh-fade" style={{ maxWidth: maxW, margin: '0 auto', padding: '52px 28px 90px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 34 }}>
                    <div>
                        <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 10 }}>Espace professionnel</span>
                        <h1 className="kh-serif kh-h1" style={{ fontWeight: 500, fontSize: 44, margin: 0 }}>Bonjour, {name}</h1>
                    </div>
                    <button onClick={() => router.post('/logout')} style={{ background: 'none', border: '1px solid rgba(34,39,31,.22)', color: KH.ink, padding: '11px 20px', borderRadius: 999, cursor: 'pointer', fontSize: 14 }}>Se déconnecter</button>
                </div>

                <div className="kh-account-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
                    {/* left column */}
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div style={{ background: KH.green, color: KH.cream, borderRadius: 16, padding: 28 }}>
                            <div style={{ width: 58, height: 58, borderRadius: '50%', background: KH.gold, display: 'grid', placeItems: 'center', fontFamily: serif, fontSize: 26, marginBottom: 18 }}>{initial}</div>
                            <h3 className="kh-serif" style={{ fontSize: 24, fontWeight: 600, margin: '0 0 4px' }}>{name}</h3>
                            <div style={{ fontSize: 13, color: 'rgba(244,239,228,.7)', marginBottom: 20 }}>Compte professionnel vérifié</div>
                            <dl style={{ margin: 0, display: 'grid', gap: 14, fontSize: 14 }}>
                                {rows.map((r) => (
                                    <div key={r.k}>
                                        <dt style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(244,239,228,.55)', marginBottom: 2 }}>{r.k}</dt>
                                        <dd style={{ margin: 0, color: KH.cream }}>{r.v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <LoyaltyCard loyalty={loyalty} />
                        <NotificationsCard />
                    </div>

                    {/* reservations */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 className="kh-serif" style={{ fontWeight: 600, fontSize: 26, margin: 0 }}>Mes réservations</h2>
                            <Link href="/produits" style={{ background: KH.green, color: KH.cream, padding: '10px 18px', borderRadius: 999, fontSize: 13 }}>Nouvelle réservation</Link>
                        </div>
                        {reservations.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px dashed rgba(34,39,31,.2)', borderRadius: 14, padding: '48px 24px', textAlign: 'center', color: 'rgba(34,39,31,.6)' }}>
                                Aucune réservation pour l'instant. <Link href="/produits" style={{ color: KH.gold }}>Parcourir le catalogue →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: 14 }}>
                                {reservations.map((r) => (
                                    <div key={r.ref} style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: '20px 22px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 10 }}>
                                            <span className="kh-serif" style={{ fontSize: 20, fontWeight: 600 }}>Réservation {r.ref}</span>
                                            <span style={badge(r.status)}>{r.status_label}</span>
                                        </div>
                                        <div style={{ fontSize: 14, color: 'rgba(34,39,31,.7)', marginBottom: 8 }}>{r.summary}</div>
                                        <div style={{ fontSize: 13, color: 'rgba(34,39,31,.55)' }}>{r.meta}</div>
                                        {r.quote_amount && (
                                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(34,39,31,.08)', fontSize: 14, color: '#33402c' }}>
                                                <strong>Devis proposé : {formatF(r.quote_amount)}</strong>
                                                {r.quote_message && <div style={{ fontSize: 13, color: 'rgba(34,39,31,.6)', marginTop: 4 }}>{r.quote_message}</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </KangaLayout>
    );
}
