<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::orderBy('position')
            ->get(['slug', 'label', 'note', 'image'])
            ->map(fn ($c) => [
                'slug' => $c->slug,
                'label' => $c->label,
                'note' => $c->note,
                'image' => $c->image,
            ]);

        return Inertia::render('home', [
            'categories' => $categories,
        ]);
    }
}
