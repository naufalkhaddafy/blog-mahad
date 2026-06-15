<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recording extends Model
{
    protected $guarded = ['id'];

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }}
