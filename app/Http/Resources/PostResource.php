<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "user" => $this->user->name,
            "category" => $this->category->name,
            "title" => $this->title,
            "description" => $this->name,
            "image" => $this->image ? Storage::url($this->image) : null,
            "slug" => $this->slug,
            "status" => $this->status,
            "tags" => $this->tags ?? [],
            "created_at" => $this->created_at->format('d F Y, H:i'),

        ];
    }
}
