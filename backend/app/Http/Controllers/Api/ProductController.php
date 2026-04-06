<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with('category')
            ->latest()
            ->when($request->boolean('new'), fn ($query) => $query->limit(4))
            ->get();

        return response()->json(
            $products->map(fn (Product $product) => $this->formatProduct($product))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $product = Product::create($this->validateProduct($request))
            ->load('category');

        return response()->json($this->formatProduct($product), 201);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::query()
            ->with('category')
            ->findOrFail($id);

        return response()->json($this->formatProduct($product));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::query()->findOrFail($id);
        $product->update($this->validateProduct($request));
        $product->load('category');

        return response()->json($this->formatProduct($product));
    }

    public function destroy(string $id): JsonResponse
    {
        $product = Product::query()->findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $keyword = trim((string) $request->query('q', ''));

        if ($keyword === '') {
            return response()->json([]);
        }

        $products = Product::query()
            ->with('category')
            ->where('status', 1)
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%')
                    ->orWhere('detail', 'like', '%' . $keyword . '%');
            })
            ->latest()
            ->get();

        return response()->json(
            $products->map(fn (Product $product) => $this->formatProduct($product))
        );
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

    private function formatProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'productname' => $product->productname,
            'image' => $product->image,
            'price' => (float) $product->price,
            'discount' => (float) ($product->discount ?? 0),
            'quantity' => (int) ($product->quantity ?? 0),
            'description' => $product->description,
            'detail' => $product->detail,
            'guarantee' => $product->guarantee,
            'status' => (int) ($product->status ?? 0),
            'category_id' => $product->category_id,
            'category' => $product->category,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }
}
