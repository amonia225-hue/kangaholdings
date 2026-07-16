<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTransaction;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\ReservationItem;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $confirmed = Reservation::where('status', 'confirmee');

        $caTotal = (float) (clone $confirmed)->sum('quote_amount');
        $caMonth = (float) Reservation::where('status', 'confirmee')
            ->whereYear('confirmed_at', now()->year)
            ->whereMonth('confirmed_at', now()->month)
            ->sum('quote_amount');

        // Monthly revenue over the last 6 months.
        $months = collect(range(5, 0))->map(function ($back) {
            $date = now()->startOfMonth()->subMonths($back);
            $ca = (float) Reservation::where('status', 'confirmee')
                ->whereYear('confirmed_at', $date->year)
                ->whereMonth('confirmed_at', $date->month)
                ->sum('quote_amount');

            return [
                'label' => $date->locale('fr')->isoFormat('MMM'),
                'value' => $ca,
            ];
        });

        // Top products by total quantity reserved.
        $topProducts = ReservationItem::select('name', DB::raw('SUM(qty) as total'))
            ->groupBy('name')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn ($r) => ['name' => $r->name, 'total' => (int) $r->total]);

        $recent = Reservation::with('user:id,etablissement')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Reservation $r) => [
                'id' => $r->id,
                'ref' => $r->ref,
                'etablissement' => $r->user?->etablissement,
                'status' => $r->status,
                'status_label' => $r->statusLabel(),
                'quote_amount' => $r->quote_amount,
                'created' => $r->created_at?->locale('fr')->isoFormat('D MMM, HH:mm'),
            ]);

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'ca_total' => $caTotal,
                'ca_month' => $caMonth,
                'reservations' => Reservation::count(),
                'pending' => Reservation::whereIn('status', ['en_attente_devis', 'devis_envoye'])->count(),
                'confirmed' => Reservation::where('status', 'confirmee')->count(),
                'clients' => User::where('role', 'client')->count(),
                'products' => Product::count(),
                'points' => (int) LoyaltyTransaction::sum('points'),
            ],
            'monthly' => $months,
            'topProducts' => $topProducts,
            'recent' => $recent,
        ]);
    }
}
