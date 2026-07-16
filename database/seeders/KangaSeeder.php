<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\LoyaltyTransaction;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\ReservationItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KangaSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'lapins-vivants', 'label' => 'Lapins vivants', 'note' => 'Élevage & reproduction'],
            ['slug' => 'lapins-viande', 'label' => 'Lapins prêts à cuire', 'note' => 'Entiers & découpes'],
            ['slug' => 'volailles', 'label' => 'Volailles', 'note' => 'Poulets, canards, pintades'],
            ['slug' => 'oeufs', 'label' => 'Œufs', 'note' => 'Plein air & caille'],
            ['slug' => 'legumes', 'label' => 'Légumes', 'note' => 'Maraîchage de saison'],
        ];
        $catIds = [];
        foreach ($categories as $i => $c) {
            $cat = Category::updateOrCreate(['slug' => $c['slug']], [
                'label' => $c['label'],
                'note' => $c['note'],
                'position' => $i,
            ]);
            $catIds[$c['slug']] = $cat->id;
        }

        $products = [
            ['slug' => 'lapin-neo-zelandais', 'cat' => 'lapins-vivants', 'tag' => 'Reproducteur', 'name' => 'Lapin Néo-Zélandais', 'unit' => 'La pièce', 'desc' => 'Reproducteur robuste, lignée sélectionnée pour la qualité de chair et la fécondité.'],
            ['slug' => 'lapereau-sevre', 'cat' => 'lapins-vivants', 'tag' => 'Élevage', 'name' => 'Lapereau sevré', 'unit' => 'La pièce', 'desc' => "Jeune lapin sevré, élevé sur litière paille, prêt pour votre atelier d'engraissement."],
            ['slug' => 'lapin-fermier-entier', 'cat' => 'lapins-viande', 'tag' => 'Plein air', 'name' => 'Lapin fermier entier', 'unit' => '≈ 1,4 kg', 'desc' => 'Lapin fermier prêt à cuire, chair ferme et fine, abattu et préparé à la ferme.'],
            ['slug' => 'rable-de-lapin', 'cat' => 'lapins-viande', 'tag' => 'Découpe', 'name' => 'Râble de lapin', 'unit' => 'Barquette', 'desc' => 'Le morceau noble, idéal rôti ou farci. Découpe soignée sur demande.'],
            ['slug' => 'cuisses-de-lapin', 'cat' => 'lapins-viande', 'tag' => 'Découpe', 'name' => 'Cuisses de lapin', 'unit' => 'Lot de 4', 'desc' => 'Cuisses charnues parfaites pour mijotés et confits. Conditionnement au choix.'],
            ['slug' => 'poulet-fermier-plein-air', 'cat' => 'volailles', 'tag' => 'Label', 'name' => 'Poulet fermier plein air', 'unit' => 'La pièce', 'desc' => 'Élevé 81 jours en parcours herbeux, peau dorée et chair persillée.'],
            ['slug' => 'canard-de-barbarie', 'cat' => 'volailles', 'tag' => 'Fermier', 'name' => 'Canard de Barbarie', 'unit' => 'La pièce', 'desc' => 'Canard fermier à la chair dense, idéal pour magrets et cuisses confites.'],
            ['slug' => 'pintade-fermiere', 'cat' => 'volailles', 'tag' => 'Fermier', 'name' => 'Pintade fermière', 'unit' => 'La pièce', 'desc' => 'Volaille de caractère, fine et parfumée, prisée des tables de fête.'],
            ['slug' => 'oeufs-plein-air', 'cat' => 'oeufs', 'tag' => 'Extra frais', 'name' => 'Œufs plein air', 'unit' => 'La douzaine', 'desc' => 'Pondus par nos poules en parcours, ramassés chaque matin.'],
            ['slug' => 'oeufs-de-caille', 'cat' => 'oeufs', 'tag' => 'Spécialité', 'name' => 'Œufs de caille', 'unit' => 'Plateau de 18', 'desc' => "Délicats et raffinés, parfaits en amuse-bouche ou dressage d'assiette."],
            ['slug' => 'panier-de-saison', 'cat' => 'legumes', 'tag' => 'Maraîchage', 'name' => 'Panier de saison', 'unit' => 'Le panier', 'desc' => 'Assortiment de légumes du potager, récoltés selon la saison et la disponibilité.'],
            ['slug' => 'herbes-aromatiques', 'cat' => 'legumes', 'tag' => 'Fraîches', 'name' => 'Herbes aromatiques', 'unit' => 'La botte', 'desc' => 'Thym, romarin, sarriette et estragon coupés du jour.'],
        ];
        foreach ($products as $i => $p) {
            Product::updateOrCreate(['slug' => $p['slug']], [
                'category_id' => $catIds[$p['cat']],
                'name' => $p['name'],
                'tag' => $p['tag'],
                'unit' => $p['unit'],
                'description' => $p['desc'],
                'active' => true,
                'position' => $i,
            ]);
        }

        $admin = User::updateOrCreate(['email' => 'admin@kanga.fr'], [
            'name' => 'Kanga Admin',
            'etablissement' => 'Kanga Holdings',
            'contact' => 'Éleveur référent',
            'telephone' => '05 49 00 00 00',
            'ville' => 'Niort',
            'role' => 'admin',
            'password' => Hash::make('kanga2026'),
        ]);

        $client = User::updateOrCreate(['email' => 'chef@kanga.fr'], [
            'name' => 'Le Clos des Halles',
            'etablissement' => 'Le Clos des Halles',
            'contact' => 'Chef Antoine Mercier',
            'telephone' => '06 12 34 56 78',
            'siret' => '812 345 678 00021',
            'ville' => 'Niort',
            'adresse' => '12 rue des Marchés, 79000 Niort',
            'role' => 'client',
            'password' => Hash::make('kanga2026'),
        ]);

        if ($client->reservations()->count() === 0) {
            // A few confirmed reservations spread over recent months so the
            // dashboard (CA, monthly chart) and loyalty programme have data.
            $confirmed = [
                ['ref' => 'KH-1039', 'months_ago' => 3, 'amount' => 128000, 'items' => [['lapin-fermier-entier', 12], ['pintade-fermiere', 4]]],
                ['ref' => 'KH-1040', 'months_ago' => 1, 'amount' => 76000, 'items' => [['poulet-fermier-plein-air', 6], ['oeufs-plein-air', 20]]],
                ['ref' => 'KH-1041', 'months_ago' => 0, 'amount' => 85000, 'items' => [['lapin-fermier-entier', 6], ['oeufs-plein-air', 12]]],
            ];

            $totalPoints = 0;
            foreach ($confirmed as $c) {
                $when = now()->subMonths($c['months_ago'])->startOfMonth()->addDays(9);
                $points = intdiv($c['amount'], 10000);
                $totalPoints += $points;

                $res = Reservation::create([
                    'ref' => $c['ref'],
                    'user_id' => $client->id,
                    'status' => 'confirmee',
                    'date_souhaitee' => $when->copy()->addDays(2)->toDateString(),
                    'mode' => 'Retrait à la ferme',
                    'quote_amount' => $c['amount'],
                    'quote_message' => 'Devis validé — merci de votre confiance.',
                    'confirmed_at' => $when,
                    'points_awarded' => true,
                    'created_at' => $when,
                    'updated_at' => $when,
                ]);

                foreach ($c['items'] as [$slug, $qty]) {
                    $p = Product::where('slug', $slug)->first();
                    ReservationItem::create([
                        'reservation_id' => $res->id,
                        'product_id' => $p?->id,
                        'name' => $p?->name ?? $slug,
                        'unit' => $p?->unit,
                        'qty' => $qty,
                    ]);
                }

                if ($points > 0) {
                    LoyaltyTransaction::create([
                        'user_id' => $client->id,
                        'reservation_id' => $res->id,
                        'points' => $points,
                        'amount' => $c['amount'],
                        'reason' => "Devis confirmé {$c['ref']}",
                        'created_at' => $when,
                        'updated_at' => $when,
                    ]);
                }
            }

            $client->update(['loyalty_points' => $totalPoints]);

            // In-progress orders so "commandes en cours" isn't empty.
            $pendingA = Reservation::create([
                'ref' => 'KH-1042',
                'user_id' => $client->id,
                'status' => 'en_attente_devis',
                'date_souhaitee' => now()->addDays(6)->toDateString(),
                'mode' => 'Livraison (Deux-Sèvres)',
                'note' => 'Découpe en portions individuelles si possible.',
            ]);
            ReservationItem::create(['reservation_id' => $pendingA->id, 'product_id' => Product::where('slug', 'rable-de-lapin')->value('id'), 'name' => 'Râble de lapin', 'unit' => 'Barquette', 'qty' => 10]);

            $pendingB = Reservation::create([
                'ref' => 'KH-1043',
                'user_id' => $client->id,
                'status' => 'devis_envoye',
                'date_souhaitee' => now()->addDays(3)->toDateString(),
                'mode' => 'Retrait à la ferme',
                'quote_amount' => 42000,
                'quote_message' => 'Devis proposé, en attente de votre validation.',
            ]);
            ReservationItem::create(['reservation_id' => $pendingB->id, 'product_id' => Product::where('slug', 'oeufs-de-caille')->value('id'), 'name' => 'Œufs de caille', 'unit' => 'Plateau de 18', 'qty' => 8]);
        }

        // A second professional client (with an in-progress request).
        $client2 = User::updateOrCreate(['email' => 'traiteur@kanga.fr'], [
            'name' => 'Brasserie du Port',
            'etablissement' => 'Brasserie du Port',
            'contact' => 'Julie Renard',
            'telephone' => '06 55 44 33 22',
            'siret' => '901 234 567 00018',
            'ville' => 'La Rochelle',
            'adresse' => '5 quai Valin, 17000 La Rochelle',
            'role' => 'client',
            'password' => Hash::make('kanga2026'),
        ]);
        if ($client2->reservations()->count() === 0) {
            $r = Reservation::create([
                'ref' => 'KH-1044',
                'user_id' => $client2->id,
                'status' => 'en_attente_devis',
                'date_souhaitee' => now()->addDays(8)->toDateString(),
                'mode' => 'Livraison réfrigérée (national)',
            ]);
            ReservationItem::create(['reservation_id' => $r->id, 'product_id' => Product::where('slug', 'poulet-fermier-plein-air')->value('id'), 'name' => 'Poulet fermier plein air', 'unit' => 'La pièce', 'qty' => 15]);
            ReservationItem::create(['reservation_id' => $r->id, 'product_id' => Product::where('slug', 'canard-de-barbarie')->value('id'), 'name' => 'Canard de Barbarie', 'unit' => 'La pièce', 'qty' => 6]);
        }
    }
}
