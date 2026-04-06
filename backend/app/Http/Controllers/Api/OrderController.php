<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->with(['user', 'orderDetails.product'])
            ->latest()
            ->get();

        return response()->json(
            $orders->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'user_id' => $order->user_id,
                    'user_name' => $order->user?->name ?? $order->user?->username ?? 'Guest',
                    'user_email' => $order->user?->email,
                    'total' => (float) $order->total,
                    'address' => $order->address,
                    'note' => $order->note,
                    'status' => (int) $order->status,
                    'process' => (int) ($order->process ?? 0),
                    'payment_method' => $order->payment_method,
                    'items_count' => $order->orderDetails->sum('quantity'),
                    'products' => $order->orderDetails->map(function (OrderDetail $detail) {
                        return [
                            'id' => $detail->id,
                            'product_id' => $detail->product_id,
                            'product_name' => $detail->product?->productname ?? $detail->product?->name ?? 'Product',
                            'quantity' => (int) $detail->quantity,
                            'price' => (float) $detail->price,
                            'total' => (float) $detail->total,
                        ];
                    })->values(),
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ];
            })->values()
        );
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'payment_method' => 'required|in:cod,momo',
            'address' => 'required|string'
        ]);

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

            foreach ($cartItems as $item) {
                if (!$item->product) continue;
                $total += $item->product->price * $item->quantity;
            }

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 0, // 0 = chưa thanh toán
                'payment_method' => $request->payment_method,
                'address' => $request->address
            ]);

            foreach ($cartItems as $item) {
                if (!$item->product) continue;

                $price = $item->product->price;
                $quantity = $item->quantity;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $price * $quantity
                ]);
            }

            // ================= COD =================
            if ($request->payment_method === 'cod') {
                Cart::where('user_id', $user->id)->delete();

                return response()->json([
                    'message' => 'Order created (COD)',
                    'order' => $order
                ]);
            }

            // ================= MOMO =================
            if ($request->payment_method === 'momo') {

                $endpoint = config('momo.endpoint');
                $partnerCode = config('momo.partner_code');
                $accessKey = config('momo.access_key');
                $secretKey = config('momo.secret_key');
                $redirectUrl = config('momo.redirect_url');
                $ipnUrl = config('momo.ipn_url');

                $orderId = time() . "_" . $order->id;
                $requestId = time() . "";
                $amount = (string) $total;
                $orderInfo = "Thanh toán đơn hàng #" . $order->id;
                $extraData = "";

                $rawHash = "accessKey=$accessKey"
                    . "&amount=$amount"
                    . "&extraData=$extraData"
                    . "&ipnUrl=$ipnUrl"
                    . "&orderId=$orderId"
                    . "&orderInfo=$orderInfo"
                    . "&partnerCode=$partnerCode"
                    . "&redirectUrl=$redirectUrl"
                    . "&requestId=$requestId"
                    . "&requestType=payWithATM";

                $signature = hash_hmac("sha256", $rawHash, $secretKey);

                $data = [
                    'partnerCode' => $partnerCode,
                    'partnerName' => "Test",
                    'storeId' => "MomoTestStore",
                    'requestId' => $requestId,
                    'amount' => $amount,
                    'orderId' => $orderId,
                    'orderInfo' => $orderInfo,
                    'redirectUrl' => $redirectUrl,
                    'ipnUrl' => $ipnUrl,
                    'lang' => 'vi',
                    'extraData' => $extraData,
                    'requestType' => "payWithATM",
                    'signature' => $signature
                ];

                $ch = curl_init($endpoint);

                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen(json_encode($data))
                ]);

                $result = curl_exec($ch);

                if (curl_errno($ch)) {
                    return response()->json([
                        'error' => curl_error($ch)
                    ]);
                }

                curl_close($ch);

                $result = json_decode($result, true);

                return response()->json([
                    'message' => 'Momo created',
                    'payUrl' => $result['payUrl'] ?? null
                ]);
            }

            return response()->json([
                'message' => 'Invalid payment method'
            ], 400);
        });
    }

    // ================= MOMO IPN =================
    public function momoIpn(Request $request)
    {
        $parts = explode('_', $request->orderId);
        $orderId = $parts[1] ?? null;

        if (!$orderId) {
            return response()->json(['message' => 'Invalid orderId'], 400);
        }

        $order = Order::with('orderDetails')->find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($request->resultCode == 0) {
            // thanh toán thành công
            $order->status = 1;
            $order->save();

            // 🔥 chỉ xoá sản phẩm đã đặt
            $productIds = $order->orderDetails->pluck('product_id');

            Cart::where('user_id', $order->user_id)
                ->whereIn('product_id', $productIds)
                ->delete();

            return response()->json([
                'message' => 'Thanh toán thành công, đã cập nhật order và xóa cart'
            ]);
        }

        return response()->json([
            'message' => 'Thanh toán thất bại'
        ], 400);
    }

    // ================= RETURN =================
    public function momoReturn(Request $request)
    {
        return response()->json([
            'message' => 'Return from momo',
            'data' => $request->all()
        ]);
    }
}
