<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FormResource extends JsonResource
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
            "category_id" => $this->category->id,
            "title" => $this->title,
            "description" => $this->description,
            "image" =>  $this->image ? url(Storage::url($this->image))  : null,
            "status" => $this->status,
            "tags" => $this->tags ? collect($this->tags)->map(function ($tag) {
                return [
                    'value' => $tag->id,
                    'label' => $tag->name,
                ];
            }) : [],
        ];
    }
}
