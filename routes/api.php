<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AdminCatalogController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::get('/search', [SearchController::class, 'search'])
     ->name('search');

Route::get('/catalog/data', [CatalogController::class, 'fetchData'])
     ->name('catalog.data');

     Route::prefix('admin')->group(function () {
          Route::get('/catalog/data', [AdminCatalogController::class, 'fetchData'])->name('admin.catalog.data');
          Route::post('/catalog', [AdminCatalogController::class, 'store'])->name('admin.catalog.store');
          Route::put('/catalog/{id}', [AdminCatalogController::class, 'update'])->name('admin.catalog.update');
          Route::delete('/catalog/{id}', [AdminCatalogController::class, 'destroy'])->name('admin.catalog.destroy');
      });

// Route::get('/', function(){
//      return view('welcome');
// });
//       Route::resource("items", ItemController::class);
      