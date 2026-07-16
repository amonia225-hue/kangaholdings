<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private Cart $cart) {}

    public function add(Request $request, Product $product): RedirectResponse
    {
        $this->cart->add($product->id);

        return back()->with('success', "{$product->name} ajouté à votre réservation.");
    }

    public function change(Request $request, Product $product): RedirectResponse
    {
        $delta = (int) $request->input('delta', 0);
        $this->cart->changeQty($product->id, $delta);

        return back();
    }

    public function remove(Product $product): RedirectResponse
    {
        $this->cart->remove($product->id);

        return back();
    }
}
