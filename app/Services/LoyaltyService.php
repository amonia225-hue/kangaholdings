<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    /** 1 point earned per this many FCFA of confirmed business. */
    public const RATE = 10000;

    /**
     * Credit loyalty points for a confirmed reservation, once.
     * Returns the number of points awarded (0 if none / already awarded).
     */
    public function awardForReservation(Reservation $reservation): int
    {
        if ($reservation->status !== 'confirmee' || $reservation->points_awarded) {
            return 0;
        }

        $amount = (float) $reservation->quote_amount;
        $points = (int) floor($amount / self::RATE);

        return DB::transaction(function () use ($reservation, $amount, $points) {
            $reservation->forceFill([
                'points_awarded' => true,
                'confirmed_at' => $reservation->confirmed_at ?? now(),
            ])->save();

            if ($points > 0 && $reservation->user) {
                $reservation->user->loyaltyTransactions()->create([
                    'reservation_id' => $reservation->id,
                    'points' => $points,
                    'amount' => $amount,
                    'reason' => "Devis confirmé {$reservation->ref}",
                ]);
                $reservation->user->increment('loyalty_points', $points);
            }

            return $points;
        });
    }
}
