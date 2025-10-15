<?php

namespace Database\Seeders;

use App\Models\AiTool;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AiToolRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all tools and roles
        $chatGPT = AiTool::where('name', 'ChatGPT')->first();
        $claude = AiTool::where('name', 'Claude')->first();
        $midjourney = AiTool::where('name', 'Midjourney')->first();
        $githubCopilot = AiTool::where('name', 'GitHub Copilot')->first();
        $perplexity = AiTool::where('name', 'Perplexity AI')->first();

        $owner = Role::where('name', 'owner')->first();
        $frontend = Role::where('name', 'frontend')->first();
        $backend = Role::where('name', 'backend')->first();

        // Assign AI tools to roles
        // Owner has access to all AI tools
        if ($owner) {
            $owner->aiTools()->syncWithoutDetaching([
                $chatGPT->id ?? null,
                $claude->id ?? null,
                $midjourney->id ?? null,
                $githubCopilot->id ?? null,
                $perplexity->id ?? null,
            ]);
        }

        // Frontend role has access to ChatGPT, Claude, Midjourney, and Perplexity
        if ($frontend) {
            $frontend->aiTools()->syncWithoutDetaching([
                $chatGPT->id ?? null,
                $claude->id ?? null,
                $midjourney->id ?? null,
                $perplexity->id ?? null,
            ]);
        }

        // Backend role has access to ChatGPT, Claude, GitHub Copilot, and Perplexity
        if ($backend) {
            $backend->aiTools()->syncWithoutDetaching([
                $chatGPT->id ?? null,
                $claude->id ?? null,
                $githubCopilot->id ?? null,
                $perplexity->id ?? null,
            ]);
        }
    }
}
