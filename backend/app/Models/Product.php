<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    
    protected $table = 'app_product';
    
    
    protected $fillable = [
        'productname', 'image', 'price', 'discount', 
        'quantity', 'description', 'detail', 'guarantee', 
        'status', 'category_id'
    ];
}