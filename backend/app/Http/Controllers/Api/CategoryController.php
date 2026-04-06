<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Category::query()
                ->withCount('products')
                ->orderBy('id')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $category = Category::create($this->validateCategory($request));
        $category->loadCount('products');

        return response()->json($category, 201);
    }

    public function show(string $id): JsonResponse
    {
        $category = Category::query()
            ->withCount('products')
            ->findOrFail($id);

        return response()->json($category);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $category = Category::query()->findOrFail($id);
        $category->update($this->validateCategory($request, $category->id));
        $category->loadCount('products');

        return response()->json($category);
    }

    public function destroy(string $id): JsonResponse
    {
        $category = Category::query()
            ->withCount('products')
            ->findOrFail($id);

        if ($category->products_count > 0) {
            return response()->json([
                'message' => 'Cannot delete category that still has products.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    private function validateCategory(Request $request, ?int $categoryId = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string'],
        ]);
    }
}
