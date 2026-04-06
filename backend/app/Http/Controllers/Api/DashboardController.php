<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();

        $totalRevenue = (float) Order::query()->sum('total');
        $totalOrders = (int) Order::query()->count();
        $totalProducts = (int) Product::query()->count();
        $totalCustomers = (int) User::query()
            ->where('is_staff', false)
            ->count();
        $newCustomersThisMonth = (int) User::query()
            ->where('is_staff', false)
            ->where('created_at', '>=', $monthStart)
            ->count();

        $pendingOrders = (int) Order::query()
            ->where('status', 0)
            ->count();
        $paidOrders = (int) Order::query()
            ->where('status', 1)
            ->count();
        $lowStockProducts = (int) Product::query()
            ->where('quantity', '>', 0)
            ->where('quantity', '<=', 5)
            ->count();
        $outOfStockProducts = (int) Product::query()
            ->where('quantity', '<=', 0)
            ->count();

        $revenueTrend = collect(range(6, 0))
            ->map(function (int $monthsAgo) use ($now) {
                $date = $now->copy()->subMonths($monthsAgo);
                $start = $date->copy()->startOfMonth();
                $end = $date->copy()->endOfMonth();

                return [
                    'label' => strtoupper($date->format('M')),
                    'month' => $date->format('Y-m'),
                    'revenue' => (float) Order::query()
                        ->whereBetween('created_at', [$start, $end])
                        ->sum('total'),
                    'orders' => (int) Order::query()
                        ->whereBetween('created_at', [$start, $end])
                        ->count(),
                ];
            })
            ->values();

        $salesByCategory = Category::query()
            ->leftJoin('products', 'products.category_id', '=', 'categories.id')
            ->leftJoin('order_details', 'order_details.product_id', '=', 'products.id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COUNT(DISTINCT products.id) as products_count'),
                DB::raw('COALESCE(SUM(order_details.total), 0) as revenue')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->orderBy('categories.id')
            ->limit(5)
            ->get()
            ->map(function ($category) use ($totalRevenue) {
                $revenue = (float) $category->revenue;

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'products_count' => (int) $category->products_count,
                    'revenue' => $revenue,
                    'share' => $totalRevenue > 0 ? round(($revenue / $totalRevenue) * 100, 1) : 0,
                ];
            })
            ->values();

        $recentOrders = Order::query()
            ->with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'user_name' => $order->user?->name ?? $order->user?->username ?? 'Guest',
                    'total' => (float) $order->total,
                    'status' => (int) $order->status,
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at,
                ];
            })
            ->values();

        return response()->json([
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'new_customers_this_month' => $newCustomersThisMonth,
                'paid_orders' => $paidOrders,
                'pending_orders' => $pendingOrders,
                'low_stock_products' => $lowStockProducts,
                'out_of_stock_products' => $outOfStockProducts,
            ],
            'revenue_trend' => $revenueTrend,
            'sales_by_category' => $salesByCategory,
            'recent_orders' => $recentOrders,
        ]);
    }
}
