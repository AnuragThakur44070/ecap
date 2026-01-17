<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            if ($user->role === 'ADMIN') {
                $token = $user->createToken('admin-token')->plainTextToken;
                return response()->json(['token' => $token, 'role' => 'ADMIN'], 200);
            }
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function sellerLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            if ($user->role === 'SELLER') {
                $token = $user->createToken('seller-token')->plainTextToken;
                return response()->json(['token' => $token, 'role' => 'SELLER'], 200);
            }
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
