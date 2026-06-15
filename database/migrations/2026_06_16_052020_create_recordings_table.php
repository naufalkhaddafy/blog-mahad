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
        Schema::create('recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title')->nullable();
            $table->string('file_path')->nullable();
            $table->integer('duration')->nullable(); // in seconds
            $table->bigInteger('file_size')->nullable(); // in bytes
            $table->boolean('is_published')->default(false);
            $table->string('status')->default('recording'); // recording, completed, failed
            $table->integer('ffmpeg_pid')->nullable(); // to kill the process later
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recordings');
    }
};
