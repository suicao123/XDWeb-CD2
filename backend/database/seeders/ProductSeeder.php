<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'id' => 1,
                'category_id' => 1,
                'name' => 'iPhone SE 256GB (2020)',
                'image' => 'products/iphone-se-128gb-2020-den.jpg',
                'price' => 8999000,
                'discount' => 0,
                'quantity' => 50,
                'description' => 'Phone SE 2020 – Phiên bản nâng cấp của iPhone 8...',
                'detail' => 'iOS 14, Chip xử lý: Apple A13 Bionic...',
                'guarantee' => '12 tháng',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'category_id' => 2,
                'name' => 'iPhone 17 Pro 256GB',
                'image' => 'products/iphone_17_pro_max_silver_1_7b25d56e26.png',
                'price' => 34390000,
                'discount' => 0,
                'quantity' => 70,
                'description' => 'iPhone 17 Pro được Apple trang bị chipset A19 Pro...',
                'detail' => 'Kích thước màn hình 6.3 inches...',
                'guarantee' => '12 tháng',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}