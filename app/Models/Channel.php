<?php

namespace App\Models;

use App\Enums\ChannelStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $casts = [
        'status' => ChannelStatus::class,
    ];

    public function status(): Attribute
    {
        return Attribute::make(
            get: fn(string $value) => ChannelStatus::from($value),
            set: fn(ChannelStatus $value) => $value->value,
        );
    }

    public function recordings()
    {
        return $this->hasMany(Recording::class);
    }
}
