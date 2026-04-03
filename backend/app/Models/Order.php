<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total',            // 🔥 sửa lại đúng DB
        'status',
        'payment_method',
        'address'           // 🔥 thêm vì DB yêu cầu NOT NULL
    ];

    // Quan hệ với user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với order details
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}