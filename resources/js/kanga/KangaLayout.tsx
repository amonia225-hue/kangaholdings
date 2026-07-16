import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState   } from 'react';
import type {CSSProperties, ReactNode} from 'react';
import { KH, maxW, serif } from './theme';

export type KangaUser = {
    id: number;
    name: string;
    email: string;
    etablissement: string | null;
    contact: string | null;
    telephone: string | null;
    ville: string | null;
    adresse: string | null;
    role: string;
    is_admin: boolean;
    loyalty_points: number;
} | null;

export type SharedProps = {
    auth: { user: KangaUser };
    cartCount: number;
    vapidPublicKey: string | null;
    flash: { success: string | null; error: string | null };
    name: string;
};

function Logo({ size = 52 }: { size?: number }) {
    return (
        <span
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 1px 5px rgba(35,64,23,.16)',
                flex: 'none',
                display: 'inline-block',
            }}
        >
            <img
                src="/img/kanga-logo.png"
                alt="Kanga Holdings"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)' }}
            />
        </span>
    );
}

export default function KangaLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedProps>();
    const { auth, cartCount, flash } = page.props;
    const url = page.url.split('?')[0];
    const [toast, setToast] = useState<string>('');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const msg = flash.success || flash.error;

        if (msg) {
            setToast(msg);
            const t = setTimeout(() => setToast(''), 3600);

            return () => clearTimeout(t);
        }
    }, [flash.success, flash.error]);

    const navItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Produits', href: '/produits' },
        { label: 'Réservation', href: '/reservation' },
        { label: 'Compte', href: auth.user ? '/compte' : '/login' },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
return url === '/';
}

        if (href === '/compte') {
return url === '/compte' || url === '/login' || url === '/register';
}

        return url.startsWith(href);
    };

    const navBtn = (active: boolean): CSSProperties => ({
        padding: '9px 14px',
        borderRadius: 999,
        fontSize: 14,
        letterSpacing: '.03em',
        color: active ? KH.ink : 'rgba(34,39,31,.62)',
        fontWeight: active ? 500 : 400,
        backgroundColor: active ? 'rgba(34,39,31,.07)' : 'transparent',
    });

    return (
        <div className="kh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: KH.cream }}>
            {/* TOP BAR */}
            <div style={{ background: KH.greenDeep, color: '#d9d0bd', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                <div style={{ maxWidth: maxW, margin: '0 auto', padding: '9px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <span>Élevage fermier · Plein air · Réservé aux professionnels de bouche</span>
                    <span style={{ opacity: 0.7 }} className="kh-hide-sm">Retrait ferme &amp; livraison — Deux-Sèvres</span>
                </div>
            </div>

            {/* NAV */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(244,239,228,.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(34,39,31,.14)' }}>
                <div style={{ maxWidth: maxW, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                        <Logo />
                        <span style={{ lineHeight: 1.08 }}>
                            <span className="kh-serif" style={{ display: 'block', fontSize: 23, letterSpacing: '.01em', color: '#234017' }}>Kanga Holdings</span>
                            <span style={{ display: 'block', fontSize: 10, letterSpacing: '.26em', textTransform: 'uppercase', color: KH.gold, marginTop: 3 }}>Fermiers · Plein air</span>
                        </span>
                    </Link>

                    <div className="kh-hide-md" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {navItems.map((n) => (
                            <Link key={n.href} href={n.href} style={navBtn(isActive(n.href))}>
                                {n.label}
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {auth.user?.is_admin && (
                            <Link href="/admin" style={{ ...navBtn(url.startsWith('/admin')), border: '1px solid rgba(34,39,31,.18)' }} className="kh-hide-sm">
                                Admin
                            </Link>
                        )}
                        <Link href="/reservation" style={{ position: 'relative', background: 'none', border: '1px solid rgba(34,39,31,.22)', color: KH.ink, padding: '9px 14px', borderRadius: 999, fontSize: 13, letterSpacing: '.04em', display: 'flex', alignItems: 'center', gap: 8 }}>
                            Réservation
                            {cartCount > 0 && (
                                <span style={{ background: KH.gold, color: '#fff', fontSize: 11, minWidth: 19, height: 19, padding: '0 5px', borderRadius: 999, display: 'inline-grid', placeItems: 'center' }}>{cartCount}</span>
                            )}
                        </Link>
                        <Link href={auth.user ? '/compte' : '/login'} className="kh-hide-md" style={{ background: KH.green, color: KH.cream, padding: '10px 16px', borderRadius: 999, fontSize: 13, letterSpacing: '.04em' }}>
                            {auth.user ? 'Mon espace' : 'Se connecter'}
                        </Link>

                        {/* Burger (mobile only) */}
                        <button
                            className="kh-burger"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            style={{ display: 'none', width: 42, height: 42, alignItems: 'center', justifyContent: 'center', background: KH.green, border: 'none', borderRadius: 12, cursor: 'pointer', color: KH.cream, flex: 'none' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                {menuOpen ? (
                                    <>
                                        <line x1="4" y1="4" x2="16" y2="16" />
                                        <line x1="16" y1="4" x2="4" y2="16" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="6" x2="17" y2="6" />
                                        <line x1="3" y1="10" x2="17" y2="10" />
                                        <line x1="3" y1="14" x2="17" y2="14" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                {menuOpen && (
                    <div className="kh-mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: KH.cream, borderBottom: '1px solid rgba(34,39,31,.14)', boxShadow: '0 18px 40px rgba(31,42,27,.14)', padding: '10px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4, animation: 'khfade .22s ease' }}>
                        {navItems.map((n) => {
                            const on = isActive(n.href);
                            return (
                                <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ padding: '13px 14px', borderRadius: 10, fontSize: 16, color: on ? KH.ink : 'rgba(34,39,31,.72)', fontWeight: on ? 600 : 400, background: on ? 'rgba(34,39,31,.06)' : 'transparent' }}>
                                    {n.label}
                                </Link>
                            );
                        })}
                        {auth.user?.is_admin && (
                            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ padding: '13px 14px', borderRadius: 10, fontSize: 16, color: url.startsWith('/admin') ? KH.ink : 'rgba(34,39,31,.72)', fontWeight: url.startsWith('/admin') ? 600 : 400 }}>
                                Administration
                            </Link>
                        )}
                        <Link href={auth.user ? '/compte' : '/login'} onClick={() => setMenuOpen(false)} style={{ marginTop: 6, padding: '13px 14px', borderRadius: 999, fontSize: 15, textAlign: 'center', background: KH.green, color: KH.cream }}>
                            {auth.user ? 'Mon espace' : 'Se connecter'}
                        </Link>
                    </div>
                )}
            </nav>

            {/* TOAST */}
            {toast && (
                <div style={{ position: 'fixed', top: 78, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: KH.greenDeep, color: KH.cream, padding: '13px 22px', borderRadius: 10, fontSize: 14, boxShadow: '0 12px 40px rgba(0,0,0,.25)', animation: 'khfade .3s ease' }}>
                    {toast}
                </div>
            )}

            <main style={{ flex: 1 }}>{children}</main>

            {/* FOOTER */}
            <footer style={{ background: KH.greenDeep, color: 'rgba(244,239,228,.72)' }}>
                <div className="kh-foot-grid" style={{ maxWidth: maxW, margin: '0 auto', padding: '56px 28px 30px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 34 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                            <span style={{ width: 36, height: 36, borderRadius: '50%', background: KH.gold, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: serif, fontSize: 20, fontWeight: 600 }}>K</span>
                            <span className="kh-serif" style={{ fontSize: 22, color: KH.cream, fontWeight: 600 }}>Kanga Holdings</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>Élevage fermier de lapins, volailles et primeurs. Une production patiente au service des tables exigeantes.</p>
                    </div>
                    <FootCol title="Catalogue">
                        <FootLink onClick={() => router.get('/produits', { cat: 'lapins-vivants' })}>Lapins vivants</FootLink>
                        <FootLink onClick={() => router.get('/produits', { cat: 'lapins-viande' })}>Lapins prêts à cuire</FootLink>
                        <FootLink onClick={() => router.get('/produits', { cat: 'volailles' })}>Volailles</FootLink>
                        <FootLink onClick={() => router.get('/produits', { cat: 'oeufs' })}>Œufs</FootLink>
                    </FootCol>
                    <FootCol title="Maison">
                        <FootLink onClick={() => router.get('/')}>Notre histoire</FootLink>
                        <FootLink onClick={() => router.get('/register')}>Compte pro</FootLink>
                        <FootLink onClick={() => router.get('/reservation')}>Réserver</FootLink>
                    </FootCol>
                    <FootCol title="Contact">
                        <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                            Les Grands Champs<br />79000 · Deux-Sèvres<br />05 49 00 00 00<br />bonjour@kanga.fr
                        </div>
                    </FootCol>
                </div>
                <div style={{ borderTop: '1px solid rgba(244,239,228,.14)' }}>
                    <div style={{ maxWidth: maxW, margin: '0 auto', padding: '18px 28px', fontSize: 12, letterSpacing: '.05em', color: 'rgba(244,239,228,.5)' }}>
                        © 2026 Kanga Holdings — Tous droits réservés · Réservé aux professionnels
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div>
            <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(244,239,228,.5)', marginBottom: 14 }}>{title}</div>
            {children}
        </div>
    );
}

function FootLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ display: 'block', background: 'none', border: 'none', color: 'rgba(244,239,228,.75)', cursor: 'pointer', fontSize: 14, padding: '5px 0', textAlign: 'left' }}>
            {children}
        </button>
    );
}
