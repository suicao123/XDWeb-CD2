<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Case A: Get new products
        if ($request->has('new') && $request->input('new') === 'true') {
            $query->orderBy('created_at', 'DESC')->limit(4);
        }
        // Case B: Get all products (default)
        else {
            $query->orderBy('created_at', 'DESC');
        }

        $products = $query->get();

        return response()->json($products->map(function ($product) {
            return [
                'id' => $product->id,
                'productname' => $product->productname ?? $product->name,
                'price' => $product->price,
                'image' => $product->image,
            ];
        }));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'id' => $product->id,
            'productname' => $product->productname ?? $product->name,
            'price' => $product->price,
            'image' => $product->image,
            'description' => $product->description ?? '',
            'status' => $product->status ?? 1
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
