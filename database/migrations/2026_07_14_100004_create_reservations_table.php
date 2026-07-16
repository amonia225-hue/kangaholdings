<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('en_attente_devis');
            $table->date('date_souhaitee')->nullable();
            $table->string('mode')->nullable();
            $table->text('note')->nullable();
            $table->decimal('quote_amount', 10, 2)->nullable();
            $table->text('quote_message')->nullable();
            $table->timestamps();
        });

        Schema::create('reservation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('unit')->nullable();
            $table->unsignedInteger('qty')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_items');
        Schema::dropIfExists('reservations');
    }
};
