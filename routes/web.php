<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PushController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/produits', [ProductController::class, 'index'])->name('produits');

// Cart (session-based, works for guests)
// POST-only on purpose: LiteSpeed/LWS blocks PUT/PATCH/DELETE (cf. Veriace).
Route::post('/panier/{product}', [CartController::class, 'add'])->name('cart.add');
Route::post('/panier/{product}/change', [CartController::class, 'change'])->name('cart.change');
Route::post('/panier/{product}/remove', [CartController::class, 'remove'])->name('cart.remove');

// Reservation
Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation');
Route::post('/reservation', [ReservationController::class, 'store'])->name('reservation.store');

// Account (professional space)
Route::middleware(['auth'])->group(function () {
    Route::get('/compte', AccountController::class)->name('compte');

    // Web-push subscription (PWA notifications)
    Route::post('/push/subscribe', [PushController::class, 'subscribe'])->name('push.subscribe');
    Route::post('/push/unsubscribe', [PushController::class, 'unsubscribe'])->name('push.unsubscribe');

    // Kept so the starter's Wayfinder route + settings chrome keep resolving.
    Route::redirect('/dashboard', '/compte')->name('dashboard');
});

// Admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');
    Route::get('/reservations', [AdminReservationController::class, 'index'])->name('reservations');
    Route::get('/reservations/{reservation}', [AdminReservationController::class, 'show'])->name('reservations.show');
    Route::post('/reservations/{reservation}/devis', [AdminReservationController::class, 'quote'])->name('reservations.quote');
    Route::post('/reservations/{reservation}/statut', [AdminReservationController::class, 'status'])->name('reservations.status');
    Route::get('/produits', [AdminProductController::class, 'index'])->name('produits');
    Route::post('/produits', [AdminProductController::class, 'store'])->name('produits.store');
    Route::post('/produits/{product}', [AdminProductController::class, 'update'])->name('produits.update');
    Route::post('/produits/{product}/toggle', [AdminProductController::class, 'toggle'])->name('produits.toggle');
    Route::post('/produits/{product}/delete', [AdminProductController::class, 'destroy'])->name('produits.destroy');
    Route::get('/clients', [AdminClientController::class, 'index'])->name('clients');
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::post('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::post('/categories/{category}/delete', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__.'/settings.php';
