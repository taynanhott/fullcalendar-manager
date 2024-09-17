<?php

use App\Http\Controllers\Api\TesteController;

Route::post('/teste', [TesteController::class, 'store']);