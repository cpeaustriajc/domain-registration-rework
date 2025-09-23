<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('my-domains', function () {
        return Inertia::render('my-domains');
    })->name('my-domains');

    Route::get('my-products', function () {
        return Inertia::render('my-products');
    })->name('my-products');

    Route::get('get-domain', function () {
        return Inertia::render('get-domain');
    })->name('get-domain');

    Route::get('push-domain', function () {
        return Inertia::render('push-domain');
    })->name('push-domain');

    Route::get('domain-transfer', function () {
        return Inertia::render('domain-transfer');
    })->name('domain-transfer');

    Route::get('preferences', function () {
        return Inertia::render('preferences');
    })->name('preferences');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
