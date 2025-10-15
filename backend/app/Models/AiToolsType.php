<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiToolsType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the AI tools that belong to this type.
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class, 'ai_tools_type_id');
    }
}
