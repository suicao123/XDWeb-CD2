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
                'status' => 0,
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

            // COD
            if ($request->payment_method === 'cod') {
                Cart::where('user_id', $user->id)->delete();

                return response()->json([
                    'message' => 'Order created (COD)',
                    'order' => $order
                ]);
            }

            // MOMO
            if ($request->payment_method === 'momo') {

                $endpoint = config('momo.endpoint');
                $partnerCode = config('momo.partner_code');
                $accessKey = config('momo.access_key');
                $secretKey = config('momo.secret_key');
                $redirectUrl = config('momo.redirect_url');
                $ipnUrl = config('momo.ipn_url');

                $orderId = time() . "_" . $order->id;
                $requestId = time() . "";
                $amount = (string) $total; // FIX
                $orderInfo = "Thanh toán đơn hàng #" . $order->id;
                $extraData = "";

                // FIX SIGNATURE
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

                // FIX DATA
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

                // CURL
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
                    'momo_response' => $result,
                    'payUrl' => $result['payUrl'] ?? null
                ]);
            }

            return response()->json([
                'message' => 'Invalid payment method'
            ], 400);
        });
    }

    public function momoIpn(Request $request)
    {
        $parts = explode('_', $request->orderId);
        $orderId = $parts[1];
        
        $order = Order::find($orderId);

        if ($order && $request->resultCode == 0) {
            $order->status = 1;
            $order->save();

            Cart::where('user_id', $order->user_id)->delete();
            
            return response()->json(['message' => 'Thanh toán thành công và đã xóa giỏ hàng']);
        }

        return response()->json(['message' => 'Thanh toán thất bại hoặc không tìm thấy đơn hàng'], 400);
    }

    public function momoReturn(Request $request)
    {
        return response()->json([
            'message' => 'Return from momo',
            'data' => $request->all()
        ]);
    }
}