<?php
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('/catalog/data', [CatalogController::class, 'fetchData'])
     ->name('catalog.data');

Route::get('/search', [SearchController::class, 'search'])
     ->name('search.data');

Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');

