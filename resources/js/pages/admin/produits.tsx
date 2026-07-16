import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminShell from '@/kanga/AdminShell';
import Placeholder from '@/kanga/Placeholder';
import { KH } from '@/kanga/theme';

type Category = { id: number; label: string };
type Product = {
    id: number;
    name: string;
    tag: string | null;
    unit: string | null;
    description: string | null;
    category: string | null;
    category_id: number;
    image: string | null;
    active: boolean;
};

const input = { width: '100%', padding: '10px 12px', border: '1px solid rgba(34,39,31,.2)', borderRadius: 8, fontSize: 14, background: KH.field, marginBottom: 10 } as const;
const lbl = { fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase' as const, color: 'rgba(34,39,31,.55)' };

function ProductForm({ product, categories, onDone }: { product?: Product; categories: Category[]; onDone: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string; category_id: number | string; tag: string; unit: string; description: string; active: boolean; image: File | null;
    }>({
        name: product?.name ?? '',
        category_id: product?.category_id ?? (categories[0]?.id ?? ''),
        tag: product?.tag ?? '',
        unit: product?.unit ?? '',
        description: product?.description ?? '',
        active: product?.active ?? true,
        image: null,
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        const url = product ? `/admin/produits/${product.id}` : '/admin/produits';
        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!product) reset();
                onDone();
            },
        });
    };

    return (
        <form onSubmit={save} style={{ padding: '16px 20px', background: KH.cream, borderTop: product ? '1px solid rgba(34,39,31,.08)' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <div><label style={lbl}>Nom</label><input value={data.name} onChange={(e) => setData('name', e.target.value)} style={input} required />{errors.name && <div style={{ color: '#b3261e', fontSize: 12 }}>{errors.name}</div>}</div>
                <div>
                    <label style={lbl}>Catégorie</label>
                    <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} style={input} required>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={lbl}>Tag</label><input value={data.tag} onChange={(e) => setData('tag', e.target.value)} placeholder="Ex. Plein air" style={input} /></div>
                <div><label style={lbl}>Unité</label><input value={data.unit} onChange={(e) => setData('unit', e.target.value)} placeholder="Ex. La pièce" style={input} /></div>
            </div>
            <label style={lbl}>Description</label>
            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} style={{ ...input, resize: 'vertical' }} />
            <label style={lbl}>Photo {product ? '(remplacer)' : ''}</label>
            <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} style={{ ...input, padding: 8 }} />
            {errors.image && <div style={{ color: '#b3261e', fontSize: 12, marginBottom: 8 }}>{errors.image}</div>}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button type="submit" disabled={processing} style={{ background: KH.green, color: KH.cream, border: 'none', padding: '9px 22px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>{product ? 'Enregistrer' : 'Créer le produit'}</button>
                <button type="button" onClick={onDone} style={{ background: 'none', border: '1px solid rgba(34,39,31,.2)', padding: '9px 20px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
            </div>
        </form>
    );
}

export default function AdminProduits({ products, categories }: { products: Product[]; categories: Category[] }) {
    const [editing, setEditing] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const toggle = (id: number) => router.post(`/admin/produits/${id}/toggle`, {}, { preserveScroll: true });
    const remove = (p: Product) => {
        if (confirm(`Supprimer « ${p.name} » ?`)) router.delete(`/admin/produits/${p.id}`, { preserveScroll: true });
    };

    return (
        <AdminShell title="Catalogue produits">
            <Head title="Admin · Produits — Kanga Holdings" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button onClick={() => setCreating((v) => !v)} style={{ background: KH.gold, color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 999, fontSize: 14, cursor: 'pointer' }}>
                    {creating ? 'Fermer' : '+ Nouveau produit'}
                </button>
            </div>

            {creating && (
                <div style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(34,39,31,.06)' }}>
                        <h3 className="kh-serif" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Nouveau produit</h3>
                    </div>
                    <ProductForm categories={categories} onDone={() => setCreating(false)} />
                </div>
            )}

            <div style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden' }}>
                {products.map((p) => (
                    <div key={p.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid rgba(34,39,31,.06)' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flex: 'none', background: KH.sand }}>
                                <Placeholder src={p.image} label="" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span className="kh-serif" style={{ fontSize: 19, fontWeight: 600 }}>{p.name}</span>
                                    {!p.active && <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a33', background: '#f0dada', padding: '3px 8px', borderRadius: 999 }}>Masqué</span>}
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(34,39,31,.55)', marginTop: 2 }}>{p.category} · {p.unit}{p.tag ? ` · ${p.tag}` : ''}</div>
                            </div>
                            <button onClick={() => toggle(p.id)} style={{ background: p.active ? 'rgba(34,39,31,.06)' : '#e2ead9', color: '#33402c', border: 'none', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>{p.active ? 'Désactiver' : 'Activer'}</button>
                            <button onClick={() => { setEditing(editing === p.id ? null : p.id); setCreating(false); }} style={{ background: KH.green, color: KH.cream, border: 'none', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>{editing === p.id ? 'Fermer' : 'Éditer'}</button>
                            <button onClick={() => remove(p)} style={{ background: 'none', border: '1px solid rgba(34,39,31,.18)', color: '#a33', padding: '8px 14px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>Suppr.</button>
                        </div>
                        {editing === p.id && <ProductForm product={p} categories={categories} onDone={() => setEditing(null)} />}
                    </div>
                ))}
            </div>
        </AdminShell>
    );
}
