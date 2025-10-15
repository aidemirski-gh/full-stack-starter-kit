<?php

namespace Database\Seeders;

use App\Models\AiTool;
use App\Models\AiToolsType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateAiToolsWithTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get AI Tools Types
        $textGeneration = AiToolsType::where('name', 'Text Generation')->first();
        $imageGeneration = AiToolsType::where('name', 'Image Generation')->first();
        $codeAssistant = AiToolsType::where('name', 'Code Assistant')->first();

        // Update AI Tools with appropriate types
        // ChatGPT - Text Generation
        AiTool::where('name', 'ChatGPT')->update([
            'ai_tools_type_id' => $textGeneration?->id
        ]);

        // Claude - Text Generation
        AiTool::where('name', 'Claude')->update([
            'ai_tools_type_id' => $textGeneration?->id
        ]);

        // Midjourney - Image Generation
        AiTool::where('name', 'Midjourney')->update([
            'ai_tools_type_id' => $imageGeneration?->id
        ]);

        // GitHub Copilot - Code Assistant
        AiTool::where('name', 'GitHub Copilot')->update([
            'ai_tools_type_id' => $codeAssistant?->id
        ]);

        // Perplexity AI - Text Generation (search/research assistant)
        AiTool::where('name', 'Perplexity AI')->update([
            'ai_tools_type_id' => $textGeneration?->id
        ]);
    }
}
