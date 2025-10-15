<?php

namespace Database\Seeders;

use App\Models\AiTool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AiToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aiTools = [
            [
                'name' => 'ChatGPT',
                'link' => 'https://chat.openai.com',
                'documentation' => 'https://platform.openai.com/docs',
                'description' => 'ChatGPT is an AI-powered conversational assistant developed by OpenAI. It uses advanced natural language processing to understand and respond to user queries, making it useful for content creation, coding help, research, and general information.',
                'usage' => 'Used for text generation, answering questions, writing code, creative writing, tutoring, brainstorming ideas, and general conversation. Accessible via web interface or API integration.',
            ],
            [
                'name' => 'Claude',
                'link' => 'https://claude.ai',
                'documentation' => 'https://docs.anthropic.com',
                'description' => 'Claude is an AI assistant created by Anthropic, designed to be helpful, harmless, and honest. It excels at complex reasoning, detailed analysis, coding assistance, and maintaining context in long conversations.',
                'usage' => 'Ideal for detailed analysis, document summarization, code review, creative writing, research assistance, and complex problem-solving. Available through web interface and API.',
            ],
            [
                'name' => 'Midjourney',
                'link' => 'https://www.midjourney.com',
                'documentation' => 'https://docs.midjourney.com',
                'description' => 'Midjourney is an AI-powered image generation tool that creates high-quality, artistic images from text descriptions. It is known for producing visually stunning and creative artwork with various artistic styles.',
                'usage' => 'Used for generating artwork, concept designs, illustrations, marketing materials, and creative visual content. Accessed primarily through Discord bot commands with subscription plans.',
            ],
            [
                'name' => 'GitHub Copilot',
                'link' => 'https://github.com/features/copilot',
                'documentation' => 'https://docs.github.com/en/copilot',
                'description' => 'GitHub Copilot is an AI pair programmer that helps developers write code faster. It suggests entire lines or blocks of code as you type, understanding context from comments and existing code.',
                'usage' => 'Integrated directly into IDEs like VS Code, JetBrains, and Neovim. Used for code completion, function generation, test writing, documentation, and learning new programming languages or frameworks.',
            ],
            [
                'name' => 'Perplexity AI',
                'link' => 'https://www.perplexity.ai',
                'documentation' => 'https://docs.perplexity.ai',
                'description' => 'Perplexity AI is an AI-powered search engine and research assistant that provides direct answers to questions with cited sources. It combines the power of large language models with real-time web search.',
                'usage' => 'Used for research, fact-checking, getting up-to-date information, exploring topics in depth, and finding credible sources. Accessible via web interface and mobile apps with free and pro tiers.',
            ],
        ];

        foreach ($aiTools as $tool) {
            AiTool::create($tool);
        }
    }
}
