<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function createSeller(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile_no' => 'required|string',
            'country' => 'required|string',
            'state' => 'required|string',
            'skills' => 'required|array',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'SELLER',
            'mobile_no' => $validated['mobile_no'],
            'country' => $validated['country'],
            'state' => $validated['state'],
            'skills' => $validated['skills'],
        ]);

        return response()->json(['message' => 'Seller created successfully', 'data' => $user], 201);
    }

    public function listSellers(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sellers = User::where('role', 'SELLER')->paginate($perPage);
        return response()->json($sellers);
    }

    public function deleteSeller($id)
    {
        $seller = User::where('role', 'SELLER')->findOrFail($id);
        $seller->delete();
        return response()->json(['message' => 'Seller deleted successfully']);
    }
}
