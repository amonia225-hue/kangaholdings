<?php

namespace App\Http\Controllers;

use App\Actions\CreateReservation;
use App\Services\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function __construct(private Cart $cart) {}

    public function index(): Response
    {
        return Inertia::render('reservation', [
            'items' => $this->cart->rows(),
            'isAuthed' => auth()->check(),
        ]);
    }

    public function store(Request $request, CreateReservation $creator): RedirectResponse
    {
        $data = $request->validate([
            'date' => ['nullable', 'date'],
            'mode' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($this->cart->isEmpty()) {
            return redirect()->route('produits')
                ->with('error', 'Votre réservation est vide.');
        }

        // Guest: stash the reservation intent and send to registration.
        if (! $request->user()) {
            $request->session()->put('pending_reservation', [
                'date' => $data['date'] ?? null,
                'mode' => $data['mode'] ?? null,
                'note' => $data['note'] ?? null,
            ]);

            return redirect()->route('register')
                ->with('error', 'Créez votre compte professionnel pour finaliser la réservation.');
        }

        $reservation = $creator->handle(
            $request->user(),
            $data['date'] ?? null,
            $data['mode'] ?? null,
            $data['note'] ?? null,
        );

        return redirect()->route('compte')
            ->with('success', "Réservation {$reservation->ref} envoyée — devis sous 24h.");
    }
}
