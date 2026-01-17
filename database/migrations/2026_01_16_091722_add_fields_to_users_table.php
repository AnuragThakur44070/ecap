<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('SELLER'); // ADMIN, SELLER
            $table->string('mobile_no')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->json('skills')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'mobile_no', 'country', 'state', 'skills']);
        });
    }
};
