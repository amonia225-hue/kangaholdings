import { Head, Link, router } from '@inertiajs/react';
import KangaLayout from '@/kanga/KangaLayout';
import Placeholder from '@/kanga/Placeholder';
import { KH, maxW } from '@/kanga/theme';

type Category = { slug: string; label: string };
type Product = {
    id: number;
    slug: string;
    name: string;
    tag: string | null;
    unit: string | null;
    description: string | null;
    image: string | null;
    category: string | null;
};

export default function Produits({ categories, products, activeCat }: { categories: Category[]; products: Product[]; activeCat: string }) {
    const filters = [{ slug: 'tous', label: 'Tout voir' }, ...categories];

    const filterBtn = (active: boolean) => ({
        background: active ? KH.green : '#fff',
        color: active ? KH.cream : '#33402c',
        border: `1px solid ${active ? KH.green : 'rgba(34,39,31,.18)'}`,
        padding: '9px 18px',
        borderRadius: 999,
        fontSize: 14,
        cursor: 'pointer',
        letterSpacing: '.02em',
    });

    const add = (id: number) => router.post(`/panier/${id}`, {}, { preserveScroll: true });

    return (
        <KangaLayout>
            <Head title="Catalogue — Kanga Holdings" />
            <div className="kh-fade" style={{ maxWidth: maxW, margin: '0 auto', padding: '52px 28px 90px' }}>
                <span style={{ display: 'block', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: KH.gold, marginBottom: 12 }}>Catalogue</span>
                <h1 className="kh-serif kh-h1" style={{ fontWeight: 500, fontSize: 48, margin: '0 0 8px' }}>Notre sélection fermière</h1>
                <p style={{ fontSize: 16, color: 'rgba(34,39,31,.7)', margin: '0 0 30px', maxWidth: 640 }}>
                    Les prix sont établis sur devis selon les cours et la quantité. Ajoutez vos lots, choisissez une date de retrait, nous confirmons chaque réservation à la main.
                </p>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 34 }}>
                    {filters.map((f) => (
                        <Link key={f.slug} href="/produits" data={{ cat: f.slug }} preserveScroll style={filterBtn(activeCat === f.slug)}>
                            {f.label}
                        </Link>
                    ))}
                </div>

                {products.length === 0 ? (
                    <p style={{ fontSize: 15, color: 'rgba(34,39,31,.6)' }}>Aucun produit dans cette catégorie pour le moment.</p>
                ) : (
                    <div className="kh-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
                        {products.map((p) => (
                            <div key={p.id} className="kh-lift" style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', aspectRatio: '4/3', background: KH.sand }}>
                                    <Placeholder src={p.image} label={p.name} alt={p.name} />
                                    {p.tag && (
                                        <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(31,42,27,.9)', color: KH.cream, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, pointerEvents: 'none' }}>{p.tag}</span>
                                    )}
                                </div>
                                <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(34,39,31,.5)' }}>{p.category}</span>
                                    <h3 className="kh-serif" style={{ fontWeight: 600, fontSize: 24, margin: '5px 0 8px', color: KH.ink }}>{p.name}</h3>
                                    <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(34,39,31,.7)', margin: '0 0 16px', flex: 1 }}>{p.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                        <span style={{ fontSize: 13, color: '#33402c', background: KH.cream2, padding: '5px 11px', borderRadius: 999 }}>{p.unit}</span>
                                        <button onClick={() => add(p.id)} style={{ background: KH.green, color: KH.cream, border: 'none', padding: '10px 18px', borderRadius: 999, fontSize: 13, letterSpacing: '.03em', cursor: 'pointer' }}>Ajouter</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </KangaLayout>
    );
}
