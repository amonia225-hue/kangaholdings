# Kanga Holdings — E-commerce fermier B2B (spec)

**Date:** 2026-07-14
**Stack:** Laravel 13 · Inertia v3 · React 19 (TS) · Tailwind 4 · Fortify · shadcn/ui · SQLite

## Concept
Boutique fermière **réservée aux professionnels de bouche** : lapins fermiers (vivants &
prêts à cuire), volailles, œufs, légumes. Modèle métier central : **aucun prix affiché →
réservation → devis confirmé sous 24 h**. Fidélité stricte au mockup `Kanga Holdings.dc.html`.

## Design tokens (repris du mockup)
- Fond crème `#f4efe4`, texte `#22271f`
- Vert profond `#1f2a1b` / vert sapin `#333f2c` / vert hero `#315320→#15220d`
- Or-miel `#b8862b`, or clair `#e0b24e` / `#c2922b`
- Sable `#eae1cf` / `#dfd6c2`, champ `#faf7f0`
- Titres **DM Serif Display**, texte **Mulish** (Google Fonts)
- Rayons pilule `999px`, cartes `14px`, radius medias `12–16px`

## Écrans publics (Inertia)
| Écran | Route | Notes |
|---|---|---|
| Accueil | `GET /` | topbar, nav sticky, hero collage, trust strip, bento 5 catégories, story, bande CTA, footer |
| Produits | `GET /produits?cat=` | filtres catégories, grille 3 col, badge tag, bouton Ajouter (sans prix) |
| Réservation | `GET /reservation` | panier (qty ±, retirer) + form (date/mode/note) ; état vide ; garde auth |
| Auth | `GET /login` `GET /register` | split-screen ambiance ferme + form pro ; endpoints Fortify |
| Compte | `GET /compte` (auth) | carte profil verte + liste réservations avec badge statut |
| Déconnexion | `POST /logout` | Fortify |

## Espace admin (`/admin`, role=admin)
- `GET /admin/reservations` — file des demandes entrantes
- `GET /admin/reservations/{ref}` — détail (items + client)
- `POST /admin/reservations/{id}/devis` — saisir devis (montant + message) → statut `devis_envoye`
- `POST /admin/reservations/{id}/statut` — confirmer / refuser
- `GET /admin/produits` + `POST /admin/produits/{id}` — activer/désactiver, éditer

## Données
- **categories**: id, slug, label, note, position, image
- **products**: id, category_id, slug, name, tag, unit, description, image, active, position
- **users** (+ champs pro): etablissement, contact, telephone, siret, ville, adresse, role(client|admin)
- **reservations**: id, ref (KH-####), user_id, status(en_attente_devis|devis_envoye|confirmee|refusee),
  date_souhaitee, mode, note, quote_amount(nullable), quote_message(nullable)
- **reservation_items**: id, reservation_id, product_id, name(snapshot), unit(snapshot), qty

## Panier
Stocké en **session** (`cart` = [product_id => qty]) — fonctionne sans compte. À la
soumission de réservation : si non authentifié → flash + redirect `/register` en conservant
panier + date/mode en session (`pending_reservation`) ; après inscription/connexion, la
réservation est créée automatiquement. Partagé à Inertia via `cart_count`.

## Seeds
- 5 catégories, 12 produits (données exactes du mockup, sans prix)
- admin `admin@kanga.fr` / `kanga2026` (role=admin)
- client démo `chef@kanga.fr` / `kanga2026` + 1 réservation confirmée d'exemple

## Hors périmètre (YAGNI)
Pas de paiement en ligne, pas de prix, pas de multilingue, pas d'emails réels
(statuts internes + toasts). Photos = placeholders soignés + 3 assets du zip.
