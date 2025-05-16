<?php
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::resource('items', ItemController::class)->names('items');


Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');

