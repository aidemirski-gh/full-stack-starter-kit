<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles first
        $this->call(RoleSeeder::class);

        // Get roles for assignment
        $ownerRole = Role::where('name', 'owner')->first();
        $frontendRole = Role::where('name', 'frontend')->first();
        $backendRole = Role::where('name', 'backend')->first();

        // Default password for all seeded users (hashed 'password')
        $defaultPassword = Hash::make('password');

        // Create test user (skip if already exists) - assign owner role
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => $defaultPassword,
                'role_id' => $ownerRole->id,
            ]
        );

        // Create additional specific users with roles
        User::firstOrCreate(
            ['email' => 'john.doe@example.com'],
            [
                'name' => 'John Doe',
                'password' => $defaultPassword,
                'role_id' => $frontendRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'jane.smith@example.com'],
            [
                'name' => 'Jane Smith',
                'password' => $defaultPassword,
                'role_id' => $backendRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => $defaultPassword,
                'role_id' => $ownerRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => $defaultPassword,
                'role_id' => $frontendRole->id,
            ]
        );

        // Create 10 random users using faker with random roles (only if we don't have enough users)
        $currentCount = User::count();
        if ($currentCount < 15) {
            $roles = [$ownerRole->id, $frontendRole->id, $backendRole->id];

            User::factory(15 - $currentCount)->create()->each(function ($user) use ($roles) {
                $user->role_id = $roles[array_rand($roles)];
                $user->save();
            });
        }
    }
}
