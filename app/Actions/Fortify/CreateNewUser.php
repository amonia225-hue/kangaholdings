<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered professional account.
     *
     * The mockup uses a single password field (no confirmation), so we
     * validate the password directly instead of Fortify's confirmed rule.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'etablissement' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'telephone' => ['required', 'string', 'max:40'],
            'siret' => ['nullable', 'string', 'max:40'],
            'ville' => ['required', 'string', 'max:255'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', Password::default()],
        ], [
            'etablissement.required' => "Le nom de l'établissement est requis.",
            'contact.required' => 'Le nom du contact est requis.',
            'telephone.required' => 'Le téléphone est requis.',
            'ville.required' => 'La ville est requise.',
        ])->validate();

        return User::create([
            'name' => $input['etablissement'],
            'etablissement' => $input['etablissement'],
            'contact' => $input['contact'],
            'email' => $input['email'],
            'telephone' => $input['telephone'],
            'siret' => $input['siret'] ?? null,
            'ville' => $input['ville'],
            'adresse' => $input['adresse'] ?? null,
            'role' => 'client',
            'password' => $input['password'],
        ]);
    }
}
