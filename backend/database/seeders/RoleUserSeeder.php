<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all roles
        $ownerRole = Role::where('name', 'owner')->first();
        $frontendRole = Role::where('name', 'frontend')->first();
        $backendRole = Role::where('name', 'backend')->first();

        // Get all users
        $testUser = User::where('email', 'test@example.com')->first();
        $johnDoe = User::where('email', 'john.doe@example.com')->first();
        $janeSmith = User::where('email', 'jane.smith@example.com')->first();
        $adminUser = User::where('email', 'admin@example.com')->first();
        $demoUser = User::where('email', 'demo@example.com')->first();

        // Assign multiple roles to users
        if ($testUser && $ownerRole && $backendRole) {
            // Test user has owner and backend roles
            $testUser->roles()->syncWithoutDetaching([$ownerRole->id, $backendRole->id]);
        }

        if ($johnDoe && $frontendRole) {
            // John Doe has only frontend role
            $johnDoe->roles()->syncWithoutDetaching([$frontendRole->id]);
        }

        if ($janeSmith && $backendRole && $frontendRole) {
            // Jane Smith has both backend and frontend roles
            $janeSmith->roles()->syncWithoutDetaching([$backendRole->id, $frontendRole->id]);
        }

        if ($adminUser && $ownerRole && $frontendRole && $backendRole) {
            // Admin user has all roles
            $adminUser->roles()->syncWithoutDetaching([$ownerRole->id, $frontendRole->id, $backendRole->id]);
        }

        if ($demoUser && $frontendRole) {
            // Demo user has only frontend role
            $demoUser->roles()->syncWithoutDetaching([$frontendRole->id]);
        }

        // Assign random roles to other users
        $otherUsers = User::whereNotIn('email', [
            'test@example.com',
            'john.doe@example.com',
            'jane.smith@example.com',
            'admin@example.com',
            'demo@example.com'
        ])->get();

        foreach ($otherUsers as $user) {
            // Randomly assign 1-2 roles to each user
            $roleCount = rand(1, 2);
            $roles = Role::inRandomOrder()->limit($roleCount)->pluck('id')->toArray();
            $user->roles()->syncWithoutDetaching($roles);
        }
    }
}
