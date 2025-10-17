<?php

namespace Database\Seeders;

use App\Models\AiTool;
use App\Models\AiToolsType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiToolAiToolsTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the many-to-many relationships between AI tools and their types
        $relationships = [
            'ChatGPT' => [
                'Text Generation',  // Primary capability
                'Code Assistant',   // Also helps with coding
            ],
            'Claude' => [
                'Text Generation',  // Primary capability
                'Code Assistant',   // Strong coding abilities
            ],
            'Midjourney' => [
                'Image Generation', // Primary and only capability
            ],
            'GitHub Copilot' => [
                'Code Assistant',   // Primary capability
                'Text Generation',  // Also generates documentation and comments
            ],
            'Perplexity AI' => [
                'Text Generation',  // Primary capability for answers and research
            ],
        ];

        foreach ($relationships as $toolName => $typeNames) {
            // Find the AI tool by name
            $aiTool = AiTool::where('name', $toolName)->first();

            if (!$aiTool) {
                $this->command->warn("AI Tool '{$toolName}' not found. Skipping...");
                continue;
            }

            foreach ($typeNames as $typeName) {
                // Find the AI tool type by name
                $aiToolsType = AiToolsType::where('name', $typeName)->first();

                if (!$aiToolsType) {
                    $this->command->warn("AI Tools Type '{$typeName}' not found. Skipping...");
                    continue;
                }

                // Insert the relationship into the pivot table
                DB::table('ai_tool_ai_tools_type')->insertOrIgnore([
                    'ai_tool_id' => $aiTool->id,
                    'ai_tools_type_id' => $aiToolsType->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info("Linked '{$toolName}' with type '{$typeName}'");
            }
        }

        $this->command->info('AI Tool to AI Tools Type relationships seeded successfully!');
    }
}
