<?php

namespace App\Listeners;

use App\Actions\CreateReservation;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Session;

class FinalizePendingReservation
{
    public function __construct(private CreateReservation $creator) {}

    /**
     * When a user logs in (including right after registration), turn any
     * pending guest reservation into a real reservation.
     */
    public function handle(Login $event): void
    {
        $pending = Session::pull('pending_reservation');
        if (! $pending || ! $event->user) {
            return;
        }

        $reservation = $this->creator->handle(
            $event->user,
            $pending['date'] ?? null,
            $pending['mode'] ?? null,
            $pending['note'] ?? null,
        );

        if ($reservation) {
            Session::flash('success', "Réservation {$reservation->ref} envoyée — devis sous 24h.");
        }
    }
}
