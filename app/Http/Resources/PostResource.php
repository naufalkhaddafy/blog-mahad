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
            "user" => (object) [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            "category" => (object)[
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            "title" => $this->title,
            "description" => $this->description,
            "image" =>  $this->image,
            "imageSrc" =>  $this->image ? asset(Storage::url($this->image))  : 'https://placehold.co/1280x720/000000/FFFFFF/?font=source-sans-pro&text=' . $this->title,
            "slug" => $this->slug,
            "views" => $this->views,
            "status" => $this->status,
            "created_at" =>  $this->created_at->diffForHumans(),
            "tags" => $this->tags ? collect($this->tags)->map(function ($tag) {
                return [
                    'value' => $tag->id,
                    'label' => $tag->name,
                ];
            }) : [],

        ];
    }
}
