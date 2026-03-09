<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    // Lấy tất cả user (trả về JSON)
    public function index()
    {
        return response()->json(User::select('id', 'name')->get());
    }

    // Lấy 1 user theo ID
    public function show($id)
    {
        $user = User::select('id', 'name')->find($id);
        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($user);
    }
}