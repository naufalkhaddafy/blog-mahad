<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostSingleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        Carbon::setLocale('id');

        return [
            "id" => $this->id,
            "user" => $this->user ? (object) [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ] : null,
            "category" => $this->category ? (object)[
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            "title" => $this->title,
            "description" => $this->description,
            "image" =>  $this->image,
            "imageSrc" =>  $this->image ? asset(Storage::url($this->image))  : 'https://placehold.co/1280x720/000000/FFFFFF/?font=source-sans-pro&text=' . $this->title,
            "slug" => $this->slug,
            "views" => $this->views,
            "status" => $this->status,
            "created_at" =>  $this->created_at->diffInMonths() < 1 ? $this->created_at->diffForHumans() : $this->created_at->translatedFormat('d F Y'),
            "tags" => $this->tags ? collect($this->tags)->map(function ($tag) {
                return [
                    'value' => $tag->id,
                    'label' => $tag->name,
                ];
            }) : [],

        ];
    }
}
