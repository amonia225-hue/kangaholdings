<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class Cart
{
    private const KEY = 'cart';

    /** @return array<int,int> product_id => qty */
    public function raw(): array
    {
        return Session::get(self::KEY, []);
    }

    public function add(int $productId): void
    {
        $cart = $this->raw();
        $cart[$productId] = ($cart[$productId] ?? 0) + 1;
        Session::put(self::KEY, $cart);
    }

    public function setQty(int $productId, int $qty): void
    {
        $cart = $this->raw();
        if ($qty <= 0) {
            unset($cart[$productId]);
        } else {
            $cart[$productId] = min($qty, 999);
        }
        Session::put(self::KEY, $cart);
    }

    public function changeQty(int $productId, int $delta): void
    {
        $cart = $this->raw();
        $current = $cart[$productId] ?? 0;
        $this->setQty($productId, $current + $delta);
    }

    public function remove(int $productId): void
    {
        $cart = $this->raw();
        unset($cart[$productId]);
        Session::put(self::KEY, $cart);
    }

    public function clear(): void
    {
        Session::forget(self::KEY);
    }

    public function count(): int
    {
        return array_sum($this->raw());
    }

    public function isEmpty(): bool
    {
        return $this->count() === 0;
    }

    /** Rows enriched with product data, ignoring missing/inactive products. */
    public function rows(): Collection
    {
        $cart = $this->raw();
        if (empty($cart)) {
            return collect();
        }

        $products = Product::with('category')
            ->whereIn('id', array_keys($cart))
            ->get()
            ->keyBy('id');

        return collect($cart)
            ->filter(fn ($qty, $id) => $products->has($id))
            ->map(fn ($qty, $id) => [
                'id' => (int) $id,
                'name' => $products[$id]->name,
                'unit' => $products[$id]->unit,
                'image' => $products[$id]->image,
                'category' => $products[$id]->category?->label,
                'qty' => (int) $qty,
            ])
            ->values();
    }
}
