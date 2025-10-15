<?php

namespace Database\Seeders;

use App\Models\AiTool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateAiToolTypesToPivotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all AI tools that have a type assigned
        $aiTools = AiTool::whereNotNull('ai_tools_type_id')->get();

        foreach ($aiTools as $aiTool) {
            // Insert into pivot table if not already exists
            DB::table('ai_tool_ai_tools_type')->insertOrIgnore([
                'ai_tool_id' => $aiTool->id,
                'ai_tools_type_id' => $aiTool->ai_tools_type_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Migrated ' . $aiTools->count() . ' AI tools to many-to-many relationship.');
    }
}
