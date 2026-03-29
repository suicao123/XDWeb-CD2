<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Gọi lần lượt theo thứ tự: Bảng cha trước (User, Category) -> Bảng con sau (Product)
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}