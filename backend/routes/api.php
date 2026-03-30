<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);

// Categories
Route::get('/category', [CategoryController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart/', [CartController::class, 'index']);
    Route::post('/cart/add/', [CartController::class, 'store']);
    Route::get('/cart/{id}/', [CartController::class, 'show']);
    Route::patch('/cart/{id}/', [CartController::class, 'update']);
    Route::delete('/cart/{id}/', [CartController::class, 'destroy']);
    Route::delete('/cart/remove/{id}/', [CartController::class, 'destroy']);
});
