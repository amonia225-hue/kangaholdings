import { Head, Link, router } from '@inertiajs/react';
import KangaLayout from '@/kanga/KangaLayout';
import Placeholder from '@/kanga/Placeholder';
import { KH, maxW, serif } from '@/kanga/theme';

type Category = { slug: string; label: string; note: string | null; image: string | null };

const HERO_STATS = [
    { k: '100%', v: 'Plein air' },
    { k: '24h', v: 'Devis confirmé' },
    { k: '0', v: 'Croissance forcée' },
];

const TRUST = [
    { k: '100%', v: 'Plein air' },
    { k: '24h', v: 'Devis confirmé' },
    { k: '0', v: 'Croissance forcée' },
];

const VALUES = [
    'Alimentation céréalière tracée, sans antibiotique de confort',
    'Abattage et découpe à la ferme, chaîne du froid maîtrisée',
    'Confirmation manuelle de chaque commande par un éleveur',
];

// Display treatment for the home bento (order + labels from the mockup).
const HOME_CATS = [
    { slug: 'lapins-viande', name: 'Lapins fermiers', note: 'Entiers & découpes', big: true },
    { slug: 'lapins-vivants', name: 'Reproducteurs', note: 'Élevage & reproduction', big: false },
    { slug: 'volailles', name: 'Volailles', note: 'Poulets, canards, pintades', big: false },
    { slug: 'oeufs', name: 'Œufs', note: 'Plein air & caille', big: false },
    { slug: 'legumes', name: 'Primeurs', note: 'Maraîchage de saison', big: false },
];

export default function Home({ categories }: { categories: Category[] }) {
    const imgFor = (slug: string) => categories.find((c) => c.slug === slug)?.image ?? null;
    const goCat = (slug: string) => router.get('/produits', { cat: slug });

    return (
        <KangaLayout>
            <Head title="Kanga Holdings — Élevage fermier & produits vivriers" />
            <div className="kh-fade">
                {/* HERO */}
                <section style={{ position: 'relative', overflow: 'hidden', background: '#15220d' }}>
                    <div style={{ position: 'absolute', inset: 0, background: "url('/img/veg-garden.jpg') center/cover", pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(16,26,9,.92) 0%,rgba(19,31,12,.8) 44%,rgba(22,40,16,.46) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(14,23,8,.32) 0%,transparent 32%,rgba(14,23,8,.5) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', maxWidth: maxW, margin: '0 auto', padding: '96px 28px 108px' }}>
                        <div style={{ maxWidth: 660 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(200,153,46,.45)', padding: '5px 6px 5px 15px', borderRadius: 999, marginBottom: 26 }}>
                                <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#e8cf95' }}>Maison fermière · Plein air</span>
                                <span style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', background: '#fff', flex: 'none', display: 'inline-block' }}>
                                    <img src="/img/kanga-logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)' }} />
                                </span>
                            </div>
                            <h1 className="kh-serif kh-h1" style={{ fontWeight: 400, fontSize: 60, lineHeight: 1.04, margin: '0 0 20px', color: '#f7f2e6' }}>
                                Le lapin fermier<br />&amp; les <em style={{ color: KH.goldLight, fontStyle: 'italic' }}>produits vivriers</em><br />de la ferme
                            </h1>
                            <p style={{ fontSize: 18, lineHeight: 1.62, color: 'rgba(247,242,230,.82)', margin: '0 0 32px', maxWidth: 500 }}>
                                Lapins élevés en plein air, volailles, œufs et légumes du potager — récoltés et préparés à la ferme, réservés pour les tables exigeantes.
                            </p>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
                                <Link href="/produits" style={{ background: KH.goldBtn, color: '#20300f', fontWeight: 700, padding: '15px 30px', borderRadius: 999, fontSize: 15, letterSpacing: '.02em' }}>Découvrir nos produits</Link>
                                <Link href="/reservation" style={{ background: 'transparent', color: '#f7f2e6', border: '1px solid rgba(247,242,230,.42)', padding: '15px 30px', borderRadius: 999, fontSize: 15, letterSpacing: '.02em' }}>Réserver un lot</Link>
                            </div>
                            <div style={{ display: 'flex', gap: 34, flexWrap: 'wrap' }}>
                                {HERO_STATS.map((h) => (
                                    <div key={h.v}>
                                        <div className="kh-serif" style={{ fontSize: 28, color: KH.goldLight, lineHeight: 1 }}>{h.k}</div>
                                        <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(247,242,230,.6)', marginTop: 5 }}>{h.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST STRIP */}
                <section style={{ background: KH.cream2, borderBottom: '1px solid rgba(34,39,31,.1)' }}>
                    <div className="kh-trust-grid" style={{ maxWidth: maxW, margin: '0 auto', padding: '26px 28px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
                        {TRUST.map((t) => (
                            <div key={t.v} style={{ textAlign: 'center' }}>
                                <div className="kh-serif" style={{ fontSize: 34, fontWeight: 600, color: KH.green }}>{t.k}</div>
                                <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(34,39,31,.6)', marginTop: 4 }}>{t.v}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CATEGORIES */}
                <section style={{ maxWidth: maxW, margin: '0 auto', padding: '80px 28px 40px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 36, flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 12 }}>Notre production</span>
                            <h2 className="kh-serif" style={{ fontWeight: 500, fontSize: 44, margin: 0, color: KH.ink }}>Cinq savoir-faire, une même exigence</h2>
                        </div>
                        <Link href="/produits" style={{ color: KH.gold, fontSize: 14, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Voir le catalogue →</Link>
                    </div>
                    <div className="kh-cats-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridAutoRows: 220, gap: 16 }}>
                        {HOME_CATS.map((c) => (
                            <button
                                key={c.slug}
                                onClick={() => goCat(c.slug)}
                                className={`kh-cat kh-lift ${c.big ? 'kh-cat-big' : ''}`}
                                style={{ position: 'relative', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 12, overflow: 'hidden', gridRow: c.big ? 'span 2' : undefined }}
                            >
                                <div style={{ position: 'absolute', inset: 0 }} className="kh-cat-img">
                                    <Placeholder src={imgFor(c.slug)} label={c.name} />
                                </div>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(31,42,27,0) 30%,rgba(31,42,27,.82) 100%)', pointerEvents: 'none' }} />
                                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20, textAlign: 'left', pointerEvents: 'none' }}>
                                    <span className="kh-serif" style={{ fontSize: 26, fontWeight: 600, color: KH.cream }}>{c.name}</span>
                                    <span style={{ fontSize: 12, color: 'rgba(244,239,228,.75)', marginTop: 3 }}>{c.note}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* STORY */}
                <section style={{ maxWidth: maxW, margin: '0 auto', padding: '56px 28px 90px' }}>
                    <div className="kh-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
                        <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden' }}>
                            <Placeholder src={imgFor('lapins-vivants')} label="Portrait / parcelle de la ferme" />
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 14 }}>La maison</span>
                            <h2 className="kh-serif" style={{ fontWeight: 500, fontSize: 40, lineHeight: 1.1, margin: '0 0 20px' }}>Une conduite d'élevage patiente, pensée pour le goût</h2>
                            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(34,39,31,.78)', margin: '0 0 18px' }}>
                                Nos lapins grandissent au rythme des saisons, en parcs herbeux et sur litière paille. Aucune croissance forcée : une chair ferme, fine et régulière que les chefs reconnaissent à l'assiette.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                                {VALUES.map((v) => (
                                    <li key={v} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, color: '#33402c' }}>
                                        <span style={{ color: KH.gold, fontSize: 18, lineHeight: 1.2 }}>—</span>
                                        <span>{v}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA BAND */}
                <section style={{ background: KH.green, color: KH.cream }}>
                    <div style={{ maxWidth: maxW, margin: '0 auto', padding: '64px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
                        <div style={{ maxWidth: 600 }}>
                            <h2 className="kh-serif" style={{ fontWeight: 500, fontSize: 38, margin: '0 0 12px' }}>Professionnels de bouche&nbsp;: ouvrez votre compte</h2>
                            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(244,239,228,.8)', margin: 0 }}>
                                Accédez au catalogue complet, réservez sans engagement de prix affiché, et recevez une confirmation personnalisée sous 24h.
                            </p>
                        </div>
                        <Link href="/register" style={{ background: KH.gold, color: '#fff', padding: '16px 34px', borderRadius: 999, fontSize: 15, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Créer un compte pro</Link>
                    </div>
                </section>
            </div>
        </KangaLayout>
    );
}
