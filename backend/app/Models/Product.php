<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'productname', 'name', 'image', 'price', 'discount',
        'quantity', 'description', 'detail', 'guarantee',
        'status', 'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
