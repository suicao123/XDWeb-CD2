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
        $product = Product::findOrFail($id);
        $product->update($this->validateProduct($request));

        return response()->json($product->load('category'));
    }

    /**
     * GET /product/search?q=...
     * Tìm kiếm sản phẩm theo từ khóa.
     * Chỉ trả về các trường: id, productname, price, image.
     */
    public function search(Request $request)
    {
        $keyword = trim($request->query('q', ''));

        if (empty($keyword)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Vui lòng cung cấp tham số ?q=.',
            ], 422);
        }

        $products = Product::where('status', 1)
            ->where(function ($q) use ($keyword) {
                $q->where('productname', 'LIKE', '%' . $keyword . '%')
                  ->orWhere('description', 'LIKE', '%' . $keyword . '%')
                  ->orWhere('detail',      'LIKE', '%' . $keyword . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get(['id', 'productname', 'price', 'image']);

        return response()->json($products);
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
