<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage roles']);

        // Create roles
        $superAdmin = Role::create(['name' => 'super-admin']);
        $admin = Role::create(['name' => 'admin']);

        // Super admin gets all permissions
        $superAdmin->givePermissionTo(Permission::all());

        // Assign super-admin to first user (default admin)
        $firstUser = User::first();
        if ($firstUser) {
            $firstUser->assignRole('super-admin');
        }
    }
}
