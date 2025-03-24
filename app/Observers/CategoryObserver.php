<?php

namespace App\Observers;

use App\Models\Category;

class CategoryObserver
{
    public function creating(Category $category): void
    {
        $category->slug = str()->slug($category->name);
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updating(Category $category): void
    {
        $category->slug = str()->slug($category->name);
    }
}
