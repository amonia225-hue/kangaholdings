<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('etablissement')->nullable()->after('name');
            $table->string('contact')->nullable()->after('etablissement');
            $table->string('telephone')->nullable()->after('contact');
            $table->string('siret')->nullable()->after('telephone');
            $table->string('ville')->nullable()->after('siret');
            $table->string('adresse')->nullable()->after('ville');
            $table->string('role')->default('client')->after('adresse');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['etablissement', 'contact', 'telephone', 'siret', 'ville', 'adresse', 'role']);
        });
    }
};
