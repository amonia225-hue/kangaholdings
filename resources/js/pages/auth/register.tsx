import { Head, useForm } from '@inertiajs/react';
import AuthShell, { authStyles as S } from '@/kanga/AuthShell';

const FIELDS = [
    { name: 'etablissement', label: 'Établissement', required: true, placeholder: 'Ex. Le Clos des Halles', autoComplete: 'organization' },
    { name: 'contact', label: 'Contact', required: true, placeholder: 'Nom & prénom', autoComplete: 'name' },
    { name: 'email', label: 'Email pro', type: 'email', required: true, placeholder: 'chef@restaurant.fr', autoComplete: 'email' },
    { name: 'telephone', label: 'Téléphone', required: true, placeholder: '06 12 34 56 78', autoComplete: 'tel' },
    { name: 'siret', label: 'SIRET', placeholder: 'Facultatif' },
    { name: 'ville', label: 'Ville', required: true, placeholder: 'Niort', autoComplete: 'address-level2' },
    { name: 'adresse', label: 'Adresse de livraison', span: true, placeholder: '12 rue des Marchés', autoComplete: 'street-address' },
] as const;

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        etablissement: '',
        contact: '',
        email: '',
        telephone: '',
        siret: '',
        ville: '',
        adresse: '',
        password: '',
        accept: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthShell mode="register">
            <Head title="Créer un compte pro — Kanga Holdings" />
            <form onSubmit={submit}>
                <h1 style={S.title}>Compte professionnel</h1>
                <p style={S.sub}>Réservé aux restaurants, traiteurs et métiers de bouche.</p>
                <div className="kh-signup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {FIELDS.map((f) => (
                        <div key={f.name} style={'span' in f && f.span ? { gridColumn: '1/3' } : undefined}>
                            <label style={S.label}>{f.label}</label>
                            <input
                                type={'type' in f ? f.type : 'text'}
                                required={'required' in f ? f.required : false}
                                placeholder={f.placeholder}
                                autoComplete={'autoComplete' in f ? f.autoComplete : undefined}
                                value={data[f.name]}
                                onChange={(e) => setData(f.name, e.target.value)}
                                style={S.input}
                            />
                            {errors[f.name] && <div style={S.error}>{errors[f.name]}</div>}
                        </div>
                    ))}
                    <div style={{ gridColumn: '1/3' }}>
                        <label style={S.label}>Mot de passe</label>
                        <input type="password" required placeholder="••••••••" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} style={S.input} />
                        {errors.password && <div style={S.error}>{errors.password}</div>}
                    </div>
                </div>
                <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, color: 'rgba(34,39,31,.7)', margin: '16px 0 20px', lineHeight: 1.4 }}>
                    <input type="checkbox" required checked={data.accept} onChange={(e) => setData('accept', e.target.checked)} style={{ marginTop: 3 }} />
                    J'accepte d'être recontacté pour la confirmation des devis et j'ai lu les conditions professionnelles.
                </label>
                <button type="submit" disabled={processing} style={{ ...S.submit, opacity: processing ? 0.7 : 1 }}>Créer mon compte</button>
            </form>
        </AuthShell>
    );
}
