<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $items = $this->cartItemsQuery($request->user()->id)
            ->orderByDesc('carts.id')
            ->get();

        return response()->json($this->formatCartItems($items));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem = Cart::query()->firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        $cartItem->quantity = $cartItem->exists
            ? $cartItem->quantity + $validated['quantity']
            : $validated['quantity'];

        $cartItem->save();

        return response()->json([
            'message' => 'Cart item added successfully.',
            'cart_item' => $this->findFormattedCartItem($request->user()->id, $cartItem->id),
        ], $cartItem->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $cartItem = $this->findFormattedCartItem($request->user()->id, $id);

        if (! $cartItem) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        return response()->json($cartItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem = Cart::query()
            ->where('user_id', $request->user()->id)
            ->whereKey($id)
            ->first();

        if (! $cartItem) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated successfully.',
            'cart_item' => $this->findFormattedCartItem($request->user()->id, $cartItem->id),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $cartItem = Cart::query()
            ->where('user_id', $request->user()->id)
            ->whereKey($id)
            ->first();

        if (! $cartItem) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Cart item removed successfully.',
        ]);
    }

    private function cartItemsQuery(int $userId)
    {
        return DB::table('carts')
            ->join('products', 'products.id', '=', 'carts.product_id')
            ->where('carts.user_id', $userId)
            ->select([
                'carts.id',
                'carts.user_id',
                'carts.product_id',
                'carts.quantity',
                'carts.created_at',
                'carts.updated_at',
                'products.name as product_name',
                'products.image as product_image',
                'products.price as product_price',
                'products.discount as product_discount',
                'products.quantity as product_quantity',
                'products.description as product_description',
                'products.detail as product_detail',
                'products.guarantee as product_guarantee',
                'products.status as product_status',
            ]);
    }

    private function findFormattedCartItem(int $userId, int $cartId): ?array
    {
        $cartItem = $this->cartItemsQuery($userId)
            ->where('carts.id', $cartId)
            ->first();

        if (! $cartItem) {
            return null;
        }

        return $this->formatCartItem($cartItem);
    }

    private function formatCartItems(Collection $items): array
    {
        return $items
            ->map(fn (object $item) => $this->formatCartItem($item))
            ->values()
            ->all();
    }

    private function formatCartItem(object $item): array
    {
        return [
            'id' => (int) $item->id,
            'user_id' => (int) $item->user_id,
            'product_id' => (int) $item->product_id,
            'quantity' => (int) $item->quantity,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
            'product' => [
                'id' => (int) $item->product_id,
                'name' => $item->product_name,
                'productname' => $item->product_name,
                'image' => $item->product_image,
                'price' => (float) $item->product_price,
                'discount' => (float) $item->product_discount,
                'quantity' => (int) $item->product_quantity,
                'description' => $item->product_description,
                'detail' => $item->product_detail,
                'guarantee' => $item->product_guarantee,
                'status' => (int) $item->product_status,
            ],
        ];
    }
}
