<?php

namespace App\Http\Requests;

use App\Enums\ChannelStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ChannelRequest extends FormRequest
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
        $image =  Storage::url($this->route('channel')?->image) === $this->image ? '' : ($this->file('image') ?  ['image', 'mimes:jpeg,png,jpg,gif,svg'] : ['url']);

        return [
            'name' => ['required', 'max:255'],
            'description' => ['nullable', 'max:255'],
            'url' => ['required', 'url',  $this->route('channel') ? Rule::unique('channels', 'url')->ignore($this->route('channel')->id) : Rule::unique('channels', 'url')],
            'image' => ['required', $image],
            'status' => ['required', Rule::in(ChannelStatus::cases())],
        ];
    }

/**
 * Get custom messages for validator errors.
 *
 * @return array<string, string>
 */
public function messages(): array
{
    return [
        'name.required' => 'Nama tidak boleh kosong',
        'name.max' => 'Nama tidak boleh lebih dari 255 karakter',
        'description.max' => 'Deskripsi tidak boleh lebih dari 255 karakter',
        'url.required' => 'URL tidak boleh kosong',
        'url.url' => 'Format URL tidak valid',
        'url.unique' => 'URL sudah digunakan',
        'image.required' => 'Gambar tidak boleh kosong',
        'image.image' => 'File harus berupa gambar',
        'image.mimes' => 'Format gambar harus jpeg, png, jpg, gif, atau svg',
        'image.url' => 'URL gambar tidak valid',
        'status.required' => 'Status tidak boleh kosong',
        'status.in' => 'Status tidak valid',
    ];
}

}
