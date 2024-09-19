<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubRouteResource;
use App\Models\SubRoute;

class SubRouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SubRouteResource::collection(SubRoute::orderBy('id', 'asc')->get());
    }
}
