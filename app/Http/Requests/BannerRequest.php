<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

class BannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $image = asset(Storage::url($this->route('banner')?->image)) === $this->image ? '' : ['image', 'mimes:jpeg,png,jpg'];
        return [
            "title" => "required|max:255",
            "url" => "nullable|url",
            "image" => ["required", $image],
            'status' => "boolean",
        ];
    }
}
