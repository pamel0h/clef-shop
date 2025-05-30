<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SearchController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::get('/search', [SearchController::class, 'search'])
     ->name('search');

Route::get('/catalog/data', [CatalogController::class, 'fetchData'])
     ->name('catalog.data');
