<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category:id,label')
            ->orderBy('position')
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'tag' => $p->tag,
                'unit' => $p->unit,
                'description' => $p->description,
                'category' => $p->category?->label,
                'category_id' => $p->category_id,
                'image' => $p->image,
                'active' => $p->active,
            ]);

        return Inertia::render('admin/produits', [
            'products' => $products,
            'categories' => Category::orderBy('position')->get(['id', 'label']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'tag' => ['nullable', 'string', 'max:60'],
            'unit' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        Product::create([
            'name' => $data['name'],
            'category_id' => $data['category_id'],
            'slug' => $this->uniqueSlug($data['name']),
            'tag' => $data['tag'] ?? null,
            'unit' => $data['unit'] ?? null,
            'description' => $data['description'] ?? null,
            'image' => $this->storeImage($request),
            'active' => true,
            'position' => (int) Product::max('position') + 1,
        ]);

        return back()->with('success', "Produit « {$data['name']} » créé.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'tag' => ['nullable', 'string', 'max:60'],
            'unit' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:2000'],
            'active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $payload = collect($data)->except('image')->toArray();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $payload['image'] = $this->storeImage($request);
        }

        $product->update($payload);

        return back()->with('success', "{$product->name} mis à jour.");
    }

    public function toggle(Product $product): RedirectResponse
    {
        $product->update(['active' => ! $product->active]);

        return back()->with('success', "{$product->name} ".($product->active ? 'activé' : 'désactivé').'.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $name = $product->name;
        $product->delete();

        return back()->with('success', "Produit « {$name} » supprimé.");
    }

    private function storeImage(Request $request): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        return $request->file('image')->store('products', 'public');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'produit';
        $slug = $base;
        $i = 2;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
