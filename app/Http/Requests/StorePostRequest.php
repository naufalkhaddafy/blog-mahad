<?php

namespace App\Http\Requests;

use App\Enums\PostStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
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

        $image = $this->route('post')?->image === $this->image ? '' : ['image', 'mimes:jpeg,png,jpg,gif,svg'];
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'max:2048', $image],
            'status' => ['required', Rule::in(PostStatus::cases())],
            'tags' => ['required', 'array'],
        ];
    }

    public function messages()
    {
        return [
            'category_id.required' => 'Kategori tidak boleh kosong',
            'category_id.exists' => 'Kategori tidak ditemukan',
            'title.required' => 'Judul tidak boleh kosong',
            'title.string' => 'Judul harus berupa teks',
            'title.max' => 'Judul tidak boleh lebih dari 255 karakter',
            'description.required' => 'Deskripsi tidak boleh kosong',
            'description.string' => 'Deskripsi harus berupa teks',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'File harus berupa gambar dengan format jpeg, png, jpg, gif, atau svg',
            'image.max' => 'Ukuran file tidak boleh lebih dari 2MB',
            'status.required' => 'Status tidak boleh kosong',
            'status.in' => 'Status tidak valid',
            'tags.required' => 'Tag tidak boleh kosong',
            'tags.array' => 'Tag harus berupa array',
        ];
    }
}
