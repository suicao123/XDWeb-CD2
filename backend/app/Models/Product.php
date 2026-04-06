<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'productname', 'name', 'image', 'price', 'discount',
        'quantity', 'description', 'detail', 'guarantee',
        'status', 'category_id'
    ];

    protected $appends = [
        'productname',
    ];

    public function getProductnameAttribute(): string
    {
        return $this->attributes['name'] ?? '';
    }

    public function getImageAttribute(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return str_starts_with($value, '/') ? $value : '/' . $value;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
