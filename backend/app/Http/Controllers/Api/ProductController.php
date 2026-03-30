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
    public function index()
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
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
        //
    }
}
