<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::with('posts')->get();

        return Inertia('Users/Index', [
            "users" => UserResource::collection($user),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => "required|max:255",
            'username' => 'filled|required|max:255|unique:users,username,except,id',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:8'
        ]);

        User::create($validate);

        flashMessage("Success", "Berhasil menambahkan pengguna");

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validate = $request->validate([
            'name' => "required|max:255",
            'username' => 'filled|required|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $validatePw = [];

        if ($request->password != null) {
            $validatePw = $request->validate([
                'password' => 'required|confirmed|min:8',
            ]);

            $validate['password'] = $validatePw['password'];
        }

        $user->update($validate);

        flashMessage("Success", "Berhasil merubah data pengguna");

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if (!$user) {
            return back()->withErrors([
                'errors' => 'Pengguna tidak ditemukan'
            ]);
        }

        $user->delete();

        flashMessage("Success", "Berhasil menghapus data pengguna");

        return back();
    }
}
