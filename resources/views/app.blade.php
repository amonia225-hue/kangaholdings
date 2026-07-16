<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Kanga Holdings is a light-only brand (cream palette). --}}
        <style>
            html { background-color: #f4efe4; }
        </style>

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
        <link rel="apple-touch-icon" href="/icons/icon-192.png">

        {{-- PWA --}}
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="#1f2a1b">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Kanga">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Mulish:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
