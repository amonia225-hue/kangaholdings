import { Head, useForm } from '@inertiajs/react';
import AuthShell, { authStyles as S } from '@/kanga/AuthShell';
import { KH } from '@/kanga/theme';

export default function Login({ status }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthShell mode="login">
            <Head title="Se connecter — Kanga Holdings" />
            <form onSubmit={submit}>
                <h1 style={S.title}>Bon retour</h1>
                <p style={S.sub}>Connectez-vous à votre espace professionnel.</p>
                {status && <div style={{ background: '#e2ead9', color: '#33402c', padding: '10px 14px', borderRadius: 9, fontSize: 14, marginBottom: 16 }}>{status}</div>}

                <label style={S.label}>Email pro</label>
                <input type="email" required placeholder="chef@restaurant.fr" autoComplete="email" value={data.email} onChange={(e) => setData('email', e.target.value)} style={S.input} />
                {errors.email && <div style={S.error}>{errors.email}</div>}

                <label style={{ ...S.label, marginTop: 14 }}>Mot de passe</label>
                <input type="password" required placeholder="••••••••" autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} style={S.input} />
                {errors.password && <div style={S.error}>{errors.password}</div>}

                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'rgba(34,39,31,.7)', margin: '14px 0 20px' }}>
                    <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    Rester connecté
                </label>

                <button type="submit" disabled={processing} style={{ ...S.submit, opacity: processing ? 0.7 : 1 }}>Se connecter</button>

                <p style={{ fontSize: 13, color: 'rgba(34,39,31,.6)', textAlign: 'center', marginTop: 18 }}>
                    Pas encore de compte ?{' '}
                    <a href="/register" style={{ color: KH.gold }}>Créer un compte pro</a>
                </p>
            </form>
        </AuthShell>
    );
}
