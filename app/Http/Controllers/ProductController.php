<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $cat = $request->query('cat', 'tous');

        $categories = Category::orderBy('position')->get(['slug', 'label']);
        $validSlugs = $categories->pluck('slug')->push('tous');
        if (! $validSlugs->contains($cat)) {
            $cat = 'tous';
        }

        $products = Product::active()
            ->with('category:id,slug,label')
            ->when($cat !== 'tous', function ($q) use ($cat) {
                $q->whereHas('category', fn ($c) => $c->where('slug', $cat));
            })
            ->orderBy('position')
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'tag' => $p->tag,
                'unit' => $p->unit,
                'description' => $p->description,
                'image' => $p->image,
                'category' => $p->category?->label,
            ]);

        return Inertia::render('produits', [
            'categories' => $categories,
            'products' => $products,
            'activeCat' => $cat,
        ]);
    }
}
