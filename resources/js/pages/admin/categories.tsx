import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminShell from '@/kanga/AdminShell';
import { KH } from '@/kanga/theme';

type Category = { id: number; slug: string; label: string; note: string | null; position: number; products_count: number };

const input = { width: '100%', padding: '11px 13px', border: '1px solid rgba(34,39,31,.2)', borderRadius: 9, fontSize: 14, background: KH.field } as const;
const label = { display: 'block', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: 'rgba(34,39,31,.55)', marginBottom: 5 };

function EditRow({ category, onDone }: { category: Category; onDone: () => void }) {
    const { data, setData, post, processing } = useForm({ label: category.label, note: category.note ?? '' });
    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/categories/${category.id}`, { preserveScroll: true, onSuccess: onDone });
    };
    return (
        <form onSubmit={save} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', padding: '14px 20px', background: KH.cream, borderTop: '1px solid rgba(34,39,31,.08)' }}>
            <div style={{ flex: 1 }}><label style={label}>Nom</label><input value={data.label} onChange={(e) => setData('label', e.target.value)} style={input} required /></div>
            <div style={{ flex: 1 }}><label style={label}>Note</label><input value={data.note} onChange={(e) => setData('note', e.target.value)} style={input} /></div>
            <button type="submit" disabled={processing} style={{ background: KH.green, color: KH.cream, border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>Enregistrer</button>
            <button type="button" onClick={onDone} style={{ background: 'none', border: '1px solid rgba(34,39,31,.2)', padding: '10px 18px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
        </form>
    );
}

export default function AdminCategories({ categories }: { categories: Category[] }) {
    const [editing, setEditing] = useState<number | null>(null);
    const create = useForm({ label: '', note: '' });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        create.post('/admin/categories', { preserveScroll: true, onSuccess: () => create.reset() });
    };

    const remove = (c: Category) => {
        if (c.products_count > 0) return;
        if (confirm(`Supprimer la catégorie « ${c.label} » ?`)) {
            router.delete(`/admin/categories/${c.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminShell title="Catégories de produits">
            <Head title="Admin · Catégories — Kanga Holdings" />

            {/* create */}
            <form onSubmit={submitCreate} style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, padding: 20, marginBottom: 22, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 180 }}>
                    <label style={label}>Nouvelle catégorie</label>
                    <input value={create.data.label} onChange={(e) => create.setData('label', e.target.value)} placeholder="Ex. Miel & confitures" style={input} required />
                    {create.errors.label && <div style={{ color: '#b3261e', fontSize: 12, marginTop: 4 }}>{create.errors.label}</div>}
                </div>
                <div style={{ flex: 2, minWidth: 180 }}>
                    <label style={label}>Note (facultatif)</label>
                    <input value={create.data.note} onChange={(e) => create.setData('note', e.target.value)} placeholder="Ex. Production artisanale" style={input} />
                </div>
                <button type="submit" disabled={create.processing} style={{ background: KH.gold, color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 999, fontSize: 14, cursor: 'pointer' }}>Créer</button>
            </form>

            {/* list */}
            <div style={{ background: '#fff', border: '1px solid rgba(34,39,31,.1)', borderRadius: 14, overflow: 'hidden' }}>
                {categories.map((c) => (
                    <div key={c.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid rgba(34,39,31,.06)' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="kh-serif" style={{ fontSize: 19, fontWeight: 600 }}>{c.label}</div>
                                <div style={{ fontSize: 13, color: 'rgba(34,39,31,.55)', marginTop: 2 }}>{c.note || '—'} · <span style={{ fontVariant: 'small-caps' }}>{c.slug}</span></div>
                            </div>
                            <span style={{ fontSize: 13, color: '#33402c', background: KH.cream2, padding: '5px 12px', borderRadius: 999 }}>{c.products_count} produit{c.products_count > 1 ? 's' : ''}</span>
                            <button onClick={() => setEditing(editing === c.id ? null : c.id)} style={{ background: KH.green, color: KH.cream, border: 'none', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>{editing === c.id ? 'Fermer' : 'Éditer'}</button>
                            <button onClick={() => remove(c)} disabled={c.products_count > 0} title={c.products_count > 0 ? 'Catégorie non vide' : 'Supprimer'} style={{ background: 'none', border: '1px solid rgba(34,39,31,.18)', color: c.products_count > 0 ? 'rgba(34,39,31,.3)' : '#a33', padding: '8px 14px', borderRadius: 999, fontSize: 13, cursor: c.products_count > 0 ? 'not-allowed' : 'pointer' }}>Supprimer</button>
                        </div>
                        {editing === c.id && <EditRow category={c} onDone={() => setEditing(null)} />}
                    </div>
                ))}
            </div>
        </AdminShell>
    );
}
