<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ChannelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id ?? $this['id'],
            "name" => $this->name ?? $this['name'],
            "description" => $this->description ?? $this['description'],
            "status" => $this->status ?? $this['status'],
            "url" => $this->url ?? $this['url'],
            "image" =>  isset($this->image) ?
                (Storage::disk('public')->exists($this->image)
                    ? Storage::url($this->image)
                    : $this->image)
                : (isset($this['image']) && Storage::disk('public')->exists($this['image'])
                    ? Storage::url($this['image'])
                    : $this['image']),
            "stats" => (object)[
                'listeners' => $this->currentlisteners ?? $this['currentlisteners'],
                'name' => $this->servertitle ?? $this['servertitle'],
                'description' => $this->songtitle ?? $this['songtitle'],
            ],
        ];
    }
}
