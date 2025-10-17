<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AiTool extends Model
{
    protected $fillable = [
        'name',
        'link',
        'documentation',
        'description',
        'usage',
        'ai_tools_type_id',
    ];

    /**
     * Get the AI tools type that this tool belongs to (legacy - one-to-many).
     */
    public function aiToolsType(): BelongsTo
    {
        return $this->belongsTo(AiToolsType::class);
    }

    /**
     * Get the AI tools types that this tool belongs to (many-to-many).
     */
    public function aiToolsTypes(): BelongsToMany
    {
        return $this->belongsToMany(AiToolsType::class, 'ai_tool_ai_tools_type')->withTimestamps();
    }

    /**
     * Get the roles that can use this AI tool.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }
}
