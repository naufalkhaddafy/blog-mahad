<?php

namespace App\Observers;

use App\Models\Tag;

class TagObserver
{
    public function creating(Tag $tag): void
    {
        $tag->slug = str()->slug($tag->name);
    }

    /**
     * Handle the Tag "updated" event.
     */
    public function updating(Tag $tag): void
    {
        $tag->slug = str()->slug($tag->name);
    }
}
