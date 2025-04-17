<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Kajian Islam Sangatta') }}</title>
    <link rel="icon" href="{{ asset('assets/kis-icon.png') }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('assets/icon-share.jpg') }}">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @php
        $title = $page['props']['meta']->title ?? config('app.name');
        $description =
            $page['props']['meta']->description ??
            "Kajian Islam Sangatta, Media belajar Islam untuk memperdalam pemahaman tentang Al-Qur'an dan As-Sunnah sesuai dengan pemahaman Salaf - kajianislamsangatta.com";
        $url = $page['props']['meta']->url ?? url()->current();
        $image = $page['props']['meta']->image ?? asset('assets/icon-share.jpg');
        $sizeHeight = isset($page['props']['meta']->title) && !empty($page['props']['meta']->title) ? 451 : 800;
    @endphp

    {{-- Basic meta --}}
    <meta name="author" content="Kajian Islam Sangatta">
    <meta name="description" content="{{ $description }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{ $url }}">
    <meta property="og:site_name" content="kajianislamsangatta.com">
    <meta property="og:image" content="{{ $image }}">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="{{ $sizeHeight }}">
    <meta property="og:image:type" content="image/jpeg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $title }}">
    <meta name="twitter:description" content="{{ $description }}">
    <meta name="twitter:image" content="{{ $image }}">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
