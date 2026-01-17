<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/seller/login', [AuthController::class, 'sellerLogin']);

// Admin Routes
Route::middleware(['auth:sanctum', 'role:ADMIN'])->prefix('admin')->group(function () {
    Route::post('/sellers', [AdminController::class, 'createSeller']);
    Route::get('/sellers', [AdminController::class, 'listSellers']);
    Route::delete('/sellers/{id}', [AdminController::class, 'deleteSeller']);
});

// Seller Routes
Route::middleware(['auth:sanctum', 'role:SELLER'])->prefix('seller')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}/pdf', [ProductController::class, 'generatePdf']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
