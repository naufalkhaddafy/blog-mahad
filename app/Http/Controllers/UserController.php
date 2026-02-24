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
        $user = User::with('posts', 'roles')->get();
        $roles = \Spatie\Permission\Models\Role::all()->pluck('name');

        return Inertia('Users/Index', [
            "users" => UserResource::collection($user),
            "roles" => $roles,
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
            'password' => 'required|confirmed|min:8',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::create(collect($validate)->except('role')->toArray());
        $user->assignRole($validate['role']);

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
            'role' => 'required|string|exists:roles,name',
        ]);

        $validatePw = [];

        if ($request->password != null) {
            $validatePw = $request->validate([
                'password' => 'required|confirmed|min:8',
            ]);

            $validate['password'] = $validatePw['password'];
        }

        $user->update(collect($validate)->except('role')->toArray());
        $user->syncRoles([$validate['role']]);

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

    /**
     * Toggle suspend/unsuspend user.
     */
    public function toggleSuspend(User $user)
    {
        if ($user->hasRole('super-admin')) {
            return back()->withErrors(['error' => 'Super Admin tidak bisa dinonaktifkan']);
        }

        if ($user->isSuspended()) {
            $user->update(['suspended_at' => null]);
            flashMessage("Success", "Pengguna {$user->name} berhasil diaktifkan kembali");
        } else {
            $user->update(['suspended_at' => now()]);
            flashMessage("Success", "Pengguna {$user->name} berhasil dinonaktifkan");
        }

        return back();
    }
}
