<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'iPhone SE (2020)', 'description' => '', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'iPhone 17 Pro', 'description' => '', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'iPhone 13', 'description' => '', 'created_at' => now(), 'updated_at' => now()],
            
        ]);
    }
}