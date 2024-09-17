<?php

use Illuminate\Support\Facades\Route;

Route::post('/signup', [App\Http\Controllers\Api\AuthController::class, 'signup']);