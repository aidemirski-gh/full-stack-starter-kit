<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\AiTool;
use App\Models\AiToolsType;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * This will run on first deployment and populate all necessary data.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // 1. Seed roles first (required for users)
        $this->command->info('📋 Seeding roles...');
        $this->call(RoleSeeder::class);

        // Get roles for assignment
        $ownerRole = Role::where('name', 'owner')->first();
        $frontendRole = Role::where('name', 'frontend')->first();
        $backendRole = Role::where('name', 'backend')->first();

        // 2. Seed users with roles
        $this->command->info('👥 Seeding users...');
        $this->seedUsers($ownerRole, $frontendRole, $backendRole);

        // 3. Seed user-role relationships (many-to-many pivot table)
        $this->command->info('🔗 Seeding user-role relationships...');
        $this->call(RoleUserSeeder::class);

        // 4. Seed AI Tools Types (required for AI tools)
        $this->command->info('🏷️  Seeding AI tool types...');
        $this->call(AiToolsTypeSeeder::class);

        // 5. Seed AI Tools
        $this->command->info('🤖 Seeding AI tools...');
        $this->call(AiToolSeeder::class);

        // 6. Seed AI Tool - Role relationships
        $this->command->info('🔗 Seeding AI tool-role relationships...');
        $this->call(AiToolRoleSeeder::class);

        // 7. Seed AI Tool - AI Tools Type relationships
        $this->command->info('🔗 Seeding AI tool-type relationships...');
        $this->call(AiToolAiToolsTypeSeeder::class);

        // Display summary
        $this->displaySummary();
    }

    /**
     * Seed users with default credentials
     */
    private function seedUsers($ownerRole, $frontendRole, $backendRole): void
    {
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

    /**
     * Display seeding summary
     */
    private function displaySummary(): void
    {
        $this->command->newLine();
        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->newLine();
        $this->command->info('📊 Summary:');
        $this->command->info('  - Roles: ' . Role::count());
        $this->command->info('  - Users: ' . User::count());
        $this->command->info('  - AI Tools: ' . AiTool::count());
        $this->command->info('  - AI Tool Types: ' . AiToolsType::count());
        $this->command->newLine();
        $this->command->info('🔐 Default credentials:');
        $this->command->info('  - Email: test@example.com');
        $this->command->info('  - Email: john.doe@example.com');
        $this->command->info('  - Email: jane.smith@example.com');
        $this->command->info('  - Email: admin@example.com');
        $this->command->info('  - Password: password');
        $this->command->newLine();
    }
}
