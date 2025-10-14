<?php

namespace Database\Seeders;

use App\Models\AiToolsType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AiToolsTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Text Generation',
                'description' => 'AI tools that generate written content, articles, stories, and text-based outputs using natural language processing.'
            ],
            [
                'name' => 'Image Generation',
                'description' => 'AI-powered tools for creating, editing, and manipulating images, artwork, and visual content from text prompts or other inputs.'
            ],
            [
                'name' => 'Code Assistant',
                'description' => 'AI tools designed to help developers write, debug, and optimize code across multiple programming languages.'
            ],
            [
                'name' => 'Voice & Audio',
                'description' => 'AI tools for speech recognition, text-to-speech conversion, audio generation, and voice cloning.'
            ],
            [
                'name' => 'Video Creation',
                'description' => 'AI-powered video generation, editing, and enhancement tools that can create or modify video content.'
            ],
        ];

        foreach ($types as $type) {
            AiToolsType::firstOrCreate(
                ['name' => $type['name']],
                ['description' => $type['description']]
            );
        }
    }
}
