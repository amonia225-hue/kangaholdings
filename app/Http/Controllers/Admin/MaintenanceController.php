<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;

class MaintenanceController extends Controller
{
    public function toggle(): RedirectResponse
    {
        $on = ! Setting::bool('maintenance');
        Setting::put('maintenance', $on ? '1' : '0');

        return back()->with('success', $on
            ? 'Site mis en maintenance — seuls les administrateurs y accèdent.'
            : 'Site de nouveau en ligne pour tout le monde.');
    }
}
