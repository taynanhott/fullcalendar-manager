<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable(false);
            $table->integer('expiration')->nullable(false);
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner')->nullable(false);
            $table->integer('expiration')->nullable(false);
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->nullable(false);
            $table->text('connection')->nullable(false);
            $table->text('queue')->nullable(false);
            $table->text('payload')->nullable(false);
            $table->text('exception')->nullable(false);
            $table->dateTime('failed_at')->nullable(false);
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name')->nullable(false);
            $table->integer('total_jobs')->nullable(false);
            $table->integer('pending_jobs')->nullable(false);
            $table->integer('failed_jobs')->nullable(false);
            $table->text('failed_job_ids')->nullable(false);
            $table->text('options')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('created_at')->nullable(false);
            $table->timestamp('finished_at')->nullable();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->nullable(false);
            $table->text('payload')->nullable(false);
            $table->integer('attempts')->nullable(false);
            $table->timestamp('reserved_at')->nullable();
            $table->timestamp('available_at')->nullable(false);
            $table->timestamp('created_at')->nullable(false);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token')->nullable(false);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('tokenable_type')->nullable(false);
            $table->integer('tokenable_id')->nullable(false);
            $table->string('name')->nullable(false);
            $table->string('token')->nullable(false);
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('user_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->text('payload')->nullable(false);
            $table->integer('last_activity')->nullable(false);
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(false);
            $table->string('email')->unique()->nullable(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('users');
    }
};
