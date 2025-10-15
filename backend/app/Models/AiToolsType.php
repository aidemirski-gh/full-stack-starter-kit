<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiToolsType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the AI tools that belong to this type (legacy - one-to-many).
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class, 'ai_tools_type_id');
    }

    /**
     * Get the AI tools that belong to this type (many-to-many).
     */
    public function aiToolsMany(): BelongsToMany
    {
        return $this->belongsToMany(AiTool::class, 'ai_tool_ai_tools_type')->withTimestamps();
    }
}
