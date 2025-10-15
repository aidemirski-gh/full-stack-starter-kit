<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_tool_ai_tools_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained('ai_tools')->onDelete('cascade');
            $table->foreignId('ai_tools_type_id')->constrained('ai_tools_types')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['ai_tool_id', 'ai_tools_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_ai_tools_type');
    }
};
