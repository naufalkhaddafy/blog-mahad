<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TagRequest extends FormRequest
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
        return [
            'name' => 'required|unique:tags,name|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama Tag wajib diisi.',
            'name.unique' => 'Nama Tag sudah digunakan, pilih nama lain.',
        ];
    }
}
