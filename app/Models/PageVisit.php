<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $fillable = [
        'url',
        'ip_address',
        'user_agent',
        'session_id',
        'user_id',
        'referer',
        'visited_date',
    ];

    /**
     * Get the user that made the visit (if any).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
