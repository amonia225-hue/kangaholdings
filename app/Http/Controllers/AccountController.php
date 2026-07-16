<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $reservations = $request->user()->reservations()
            ->with('items')
            ->get()
            ->map(fn (Reservation $r) => [
                'ref' => $r->ref,
                'status' => $r->status,
                'status_label' => $r->statusLabel(),
                'summary' => $r->items->map(fn ($i) => "{$i->qty}× {$i->name}")->implode(' · '),
                'meta' => trim(($r->mode ?: 'Retrait à la ferme').' · '.($r->date_souhaitee
                    ? $r->date_souhaitee->locale('fr')->isoFormat('D MMMM YYYY')
                    : 'date à préciser')),
                'quote_amount' => $r->quote_amount,
                'quote_message' => $r->quote_message,
            ]);

        $user = $request->user();
        $loyaltyHistory = $user->loyaltyTransactions()
            ->limit(20)
            ->get()
            ->map(fn ($t) => [
                'points' => $t->points,
                'reason' => $t->reason,
                'amount' => $t->amount,
                'date' => $t->created_at?->locale('fr')->isoFormat('D MMM YYYY'),
            ]);

        return Inertia::render('compte', [
            'reservations' => $reservations,
            'loyalty' => [
                'points' => $user->loyalty_points,
                'rate' => \App\Services\LoyaltyService::RATE,
                'history' => $loyaltyHistory,
            ],
        ]);
    }
}
