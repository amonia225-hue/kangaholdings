<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    protected $fillable = [
        'ref', 'user_id', 'status', 'date_souhaitee', 'mode',
        'note', 'quote_amount', 'quote_message', 'confirmed_at', 'points_awarded',
    ];

    protected $casts = [
        'date_souhaitee' => 'date',
        'quote_amount' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'points_awarded' => 'boolean',
    ];

    public const STATUSES = [
        'en_attente_devis' => 'En attente de devis',
        'devis_envoye' => 'Devis envoyé',
        'confirmee' => 'Confirmée',
        'refusee' => 'Refusée',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }

    public function statusLabel(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
