<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\CategoryObserver;

#[ObservedBy(CategoryObserver::class)]

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
