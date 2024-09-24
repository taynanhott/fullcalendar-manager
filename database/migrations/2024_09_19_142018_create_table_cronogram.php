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
        Schema::create('cronogram', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->constrained('task')->onDelete('cascade');
            $table->date('date');
            $table->time('hour_ini');
            $table->time('hour_end');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cronogram');
    }
};
