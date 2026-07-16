<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenance
{
    /**
     * Show a maintenance page to visitors while the admin keeps full access.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Setting::bool('maintenance')) {
            return $next($request);
        }

        // Admins keep full access so they can browse and turn maintenance off.
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Always let people reach the login flow, the admin area and static assets.
        if ($request->is('login', 'logout', 'admin', 'admin/*', 'build/*', 'storage/*', 'img/*', 'icons/*', 'favicon.ico', 'manifest.webmanifest', 'sw.js')) {
            return $next($request);
        }

        // Inertia expects a hard redirect (409) rather than an HTML body.
        if ($request->header('X-Inertia')) {
            return response('', 409)->header('X-Inertia-Location', url('/'));
        }

        return response()->view('maintenance', [], 503);
    }
}
