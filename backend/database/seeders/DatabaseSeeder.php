<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::truncate(); // Xóa dữ liệu cũ

        User::insert([
            ['id' => 1, 'name' => 'Nguyễn Văn A', 'email' => 'a@gmail.com', 'password' => Hash::make('123456')],
            ['id' => 2, 'name' => 'Trần Thị B', 'email' => 'b@gmail.com', 'password' => Hash::make('123456')],
            ['id' => 3, 'name' => 'Lê Văn C', 'email' => 'c@gmail.com', 'password' => Hash::make('123456')],
        ]);
    }
}