<?php

namespace App\Actions;

use App\Models\Reservation;
use App\Models\User;
use App\Services\Cart;
use Illuminate\Support\Facades\DB;

class CreateReservation
{
    public function __construct(private Cart $cart) {}

    /**
     * Create a reservation for the user from the current session cart.
     */
    public function handle(User $user, ?string $date, ?string $mode, ?string $note = null): ?Reservation
    {
        $rows = $this->cart->rows();
        if ($rows->isEmpty()) {
            return null;
        }

        return DB::transaction(function () use ($user, $date, $mode, $note, $rows) {
            $reservation = Reservation::create([
                'ref' => $this->nextRef(),
                'user_id' => $user->id,
                'status' => 'en_attente_devis',
                'date_souhaitee' => $date ?: null,
                'mode' => $mode ?: 'Retrait à la ferme',
                'note' => $note,
            ]);

            foreach ($rows as $row) {
                $reservation->items()->create([
                    'product_id' => $row['id'],
                    'name' => $row['name'],
                    'unit' => $row['unit'],
                    'qty' => $row['qty'],
                ]);
            }

            $this->cart->clear();

            return $reservation;
        });
    }

    private function nextRef(): string
    {
        $last = Reservation::max('id') ?? 0;

        return 'KH-'.(1042 + $last);
    }
}
