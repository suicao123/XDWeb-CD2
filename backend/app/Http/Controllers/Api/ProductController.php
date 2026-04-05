<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->with('category')
            ->when($request->boolean('new'), fn ($query) => $query->latest())
            ->when(!$request->boolean('new'), fn ($query) => $query->orderBy('id'))
            ->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product = Product::create($this->validateProduct($request));

        return response()->json(
            $product->load('category'),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(
            Product::with('category')->findOrFail($id)
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $product->update($this->validateProduct($request));

        return response()->json($product->load('category'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function search(Request $request)
    {
        $keyword = trim((string) $request->query('q', ''));

        if ($keyword === '') {
            return response()->json([]);
        }

        $products = Product::query()
            ->where('name', 'like', '%' . $keyword . '%')
            ->orderBy('id')
            ->get();

        return response()->json($products);
    }

    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'detail' => ['nullable', 'string'],
            'guarantee' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in([0, 1, '0', '1'])],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
        ]);
    }
}
