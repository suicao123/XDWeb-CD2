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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null');
            $table->double('total');
            $table->string('address');
            $table->longText('note')->nullable();
            $table->integer('status')->default(0);
            $table->integer('process')->default(0);
            $table->string('payment_method', 50)->nullable();
            $table->timestamps(); // Thay thế cho createddate
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
