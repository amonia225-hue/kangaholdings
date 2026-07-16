<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        $clients = User::where('role', 'client')
            ->withCount('reservations')
            ->orderByDesc('loyalty_points')
            ->get()
            ->map(function (User $u) {
                $ca = (float) $u->reservations()->where('status', 'confirmee')->sum('quote_amount');
                $pending = $u->reservations()->whereIn('status', ['en_attente_devis', 'devis_envoye'])->count();

                return [
                    'id' => $u->id,
                    'etablissement' => $u->etablissement ?: $u->name,
                    'contact' => $u->contact,
                    'email' => $u->email,
                    'telephone' => $u->telephone,
                    'ville' => $u->ville,
                    'siret' => $u->siret,
                    'points' => $u->loyalty_points,
                    'reservations' => $u->reservations_count,
                    'pending' => $pending,
                    'ca' => $ca,
                    'joined' => $u->created_at?->locale('fr')->isoFormat('MMM YYYY'),
                ];
            });

        return Inertia::render('admin/clients', [
            'clients' => $clients,
        ]);
    }
}
