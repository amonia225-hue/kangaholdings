<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->orderBy('position')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'slug' => $c->slug,
                'label' => $c->label,
                'note' => $c->note,
                'position' => $c->position,
                'products_count' => $c->products_count,
            ]);

        return Inertia::render('admin/categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        Category::create([
            'label' => $data['label'],
            'note' => $data['note'] ?? null,
            'slug' => $this->uniqueSlug($data['label']),
            'position' => (int) Category::max('position') + 1,
        ]);

        return back()->with('success', "Catégorie « {$data['label']} » créée.");
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $category->update([
            'label' => $data['label'],
            'note' => $data['note'] ?? null,
        ]);

        return back()->with('success', 'Catégorie mise à jour.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'Impossible de supprimer une catégorie qui contient des produits.');
        }

        $label = $category->label;
        $category->delete();

        return back()->with('success', "Catégorie « {$label} » supprimée.");
    }

    private function uniqueSlug(string $label): string
    {
        $base = Str::slug($label) ?: 'categorie';
        $slug = $base;
        $i = 2;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
