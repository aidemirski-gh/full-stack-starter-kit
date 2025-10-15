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
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->foreignId('ai_tools_type_id')->nullable()->after('id')->constrained('ai_tools_types')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropForeign(['ai_tools_type_id']);
            $table->dropColumn('ai_tools_type_id');
        });
    }
};
