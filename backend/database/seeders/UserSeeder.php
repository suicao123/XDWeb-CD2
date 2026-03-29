<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username' => 'admin',
                'first_name' => 'Minh',
                'last_name' => 'Quý',
                'email' => 'nmq1245@gmail.com',
                'password' => Hash::make('123456'), 
                'is_superuser' => 1,
                'is_staff' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'nhan23',
                'first_name' => 'Đỗ Thành',
                'last_name' => 'Nhân',
                'email' => 'drltl@gmail.dtn.com',
                'password' => Hash::make('123456'),
                'is_superuser' => 0,
                'is_staff' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}