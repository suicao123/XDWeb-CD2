<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();

        // ✅ Validate
        $request->validate([
            'payment_method' => 'required|in:cod,momo',
            'address' => 'required|string'
        ]);

        // Lấy cart
        $cartItems = Cart::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 400);
        }

        return DB::transaction(function () use ($cartItems, $user, $request) {

            $total = 0;

            // Tính tổng order
            foreach ($cartItems as $item) {
                if (!$item->product) continue;

                $total += $item->product->price * $item->quantity;
            }

            // Tạo order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 0,
                'payment_method' => $request->payment_method,
                'address' => $request->address
            ]);

            // 🔥 Tạo order details (FIX CHÍNH Ở ĐÂY)
            foreach ($cartItems as $item) {
                if (!$item->product) continue;

                $price = $item->product->price;
                $quantity = $item->quantity;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $price * $quantity // 🔥 BẮT BUỘC
                ]);
            }

            // COD
            if ($request->payment_method === 'cod') {
                Cart::where('user_id', $user->id)->delete();

                return response()->json([
                    'message' => 'Order created successfully (COD)',
                    'order' => $order
                ]);
            }

            // MOMO
            if ($request->payment_method === 'momo') {
                return response()->json([
                    'message' => 'Redirect to MoMo',
                    'payUrl' => 'https://test-payment.momo.vn'
                ]);
            }

            return response()->json([
                'message' => 'Invalid payment method'
            ], 400);
        });
    }
}