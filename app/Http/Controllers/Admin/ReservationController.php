<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Services\LoyaltyService;
use App\Services\WebPushService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function __construct(
        private LoyaltyService $loyalty,
        private WebPushService $push,
    ) {}

    public function index(Request $request): Response
    {
        $filter = $request->query('statut', 'tous');
        $enCours = ['en_attente_devis', 'devis_envoye'];

        $reservations = Reservation::with(['user:id,etablissement,ville', 'items'])
            ->when($filter === 'en_cours', fn ($q) => $q->whereIn('status', $enCours))
            ->when(in_array($filter, array_keys(Reservation::STATUSES), true), fn ($q) => $q->where('status', $filter))
            ->latest()
            ->get()
            ->map(fn (Reservation $r) => $this->transform($r));

        return Inertia::render('admin/reservations', [
            'reservations' => $reservations,
            'filter' => $filter,
            'stats' => [
                'total' => Reservation::count(),
                'en_cours' => Reservation::whereIn('status', $enCours)->count(),
                'pending' => Reservation::where('status', 'en_attente_devis')->count(),
                'quoted' => Reservation::where('status', 'devis_envoye')->count(),
                'confirmed' => Reservation::where('status', 'confirmee')->count(),
            ],
        ]);
    }

    public function show(Reservation $reservation): Response
    {
        $reservation->load(['user', 'items']);

        return Inertia::render('admin/reservation-show', [
            'reservation' => $this->transform($reservation, detailed: true),
            'statuses' => Reservation::STATUSES,
        ]);
    }

    public function quote(Request $request, Reservation $reservation): RedirectResponse
    {
        $data = $request->validate([
            'quote_amount' => ['required', 'numeric', 'min:0'],
            'quote_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $reservation->update([
            'quote_amount' => $data['quote_amount'],
            'quote_message' => $data['quote_message'] ?? null,
            'status' => 'devis_envoye',
        ]);

        if ($reservation->user) {
            $amount = number_format((float) $data['quote_amount'], 0, ',', ' ');
            $this->push->sendToUser(
                $reservation->user,
                'Votre devis est prêt',
                "Réservation {$reservation->ref} : devis de {$amount} F. Consultez votre espace.",
            );
        }

        return back()->with('success', "Devis envoyé pour {$reservation->ref}.");
    }

    public function status(Request $request, Reservation $reservation): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', array_keys(Reservation::STATUSES))],
        ]);

        $reservation->update(['status' => $data['status']]);

        if ($data['status'] === 'confirmee') {
            $points = $this->loyalty->awardForReservation($reservation);
            if ($reservation->user) {
                $suffix = $points > 0 ? " (+{$points} pt".($points > 1 ? 's' : '').' fidélité)' : '';
                $this->push->sendToUser(
                    $reservation->user,
                    'Réservation confirmée',
                    "Réservation {$reservation->ref} confirmée{$suffix}.",
                );
            }
        }

        return back()->with('success', "Statut de {$reservation->ref} mis à jour.");
    }

    private function transform(Reservation $r, bool $detailed = false): array
    {
        $base = [
            'id' => $r->id,
            'ref' => $r->ref,
            'status' => $r->status,
            'status_label' => $r->statusLabel(),
            'etablissement' => $r->user?->etablissement,
            'ville' => $r->user?->ville,
            'mode' => $r->mode,
            'date' => $r->date_souhaitee?->locale('fr')->isoFormat('D MMM YYYY'),
            'created' => $r->created_at?->locale('fr')->isoFormat('D MMM YYYY, HH:mm'),
            'quote_amount' => $r->quote_amount,
            'quote_message' => $r->quote_message,
            'items' => $r->items->map(fn ($i) => [
                'name' => $i->name,
                'unit' => $i->unit,
                'qty' => $i->qty,
            ]),
        ];

        if ($detailed) {
            $base['note'] = $r->note;
            $base['client'] = [
                'etablissement' => $r->user?->etablissement,
                'contact' => $r->user?->contact,
                'email' => $r->user?->email,
                'telephone' => $r->user?->telephone,
                'ville' => $r->user?->ville,
                'adresse' => $r->user?->adresse,
                'siret' => $r->user?->siret,
            ];
        }

        return $base;
    }
}
