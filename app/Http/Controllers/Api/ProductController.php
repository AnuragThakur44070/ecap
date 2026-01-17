<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Brand;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string',
            'product_description' => 'required|string',
            'brands' => 'required|array',
            'brands.*.brand_name' => 'required|string',
            'brands.*.detail' => 'nullable|string',
            'brands.*.price' => 'required|numeric',
        ]);

        $product = Product::create([
            'user_id' => Auth::id(),
            'name' => $validated['product_name'],
            'description' => $validated['product_description'],
        ]);

        foreach ($request->brands as $index => $brandData) {
            $imagePath = null;
            if ($request->hasFile("brands.$index.image")) {
                $imagePath = $request->file("brands.$index.image")->store('brands', 'public');
            }

            $product->brands()->create([
                'name' => $brandData['brand_name'],
                'detail' => $brandData['detail'] ?? null,
                'price' => $brandData['price'],
                'image' => $imagePath,
            ]);
        }

        return response()->json(['message' => 'Product added successfully'], 201);
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $products = Auth::user()->products()->with('brands')->paginate($perPage);
        return response()->json($products);
    }

    public function generatePdf($id)
    {
        $product = Auth::user()->products()->with('brands')->findOrFail($id);
        
        $totalPrice = $product->brands->sum('price');
        
        $pdf = Pdf::loadView('pdf.product', compact('product', 'totalPrice'));
        
        return $pdf->download('product-'.$id.'.pdf');
    }

    public function destroy($id)
    {
        $product = Auth::user()->products()->findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
