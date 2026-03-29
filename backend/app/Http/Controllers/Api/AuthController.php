<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        [$firstName, $lastName] = $this->resolveNames($validated);

        $user = User::create([
            'username' => $this->resolveUsername($validated),
            'first_name' => $validated['first_name'] ?? $firstName,
            'last_name' => $validated['last_name'] ?? $lastName,
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_active' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register successful.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'login' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $identifier = $credentials['login']
            ?? $credentials['email']
            ?? $credentials['username']
            ?? null;

        if (! $identifier) {
            return response()->json([
                'message' => 'The email or username field is required.',
                'errors' => [
                    'login' => ['The email or username field is required.'],
                ],
            ], 422);
        }

        $user = User::where('email', $identifier)
            ->orWhere('username', $identifier)
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    private function resolveNames(array $validated): array
    {
        if (! empty($validated['first_name']) || ! empty($validated['last_name'])) {
            return [
                $validated['first_name'] ?? null,
                $validated['last_name'] ?? null,
            ];
        }

        $name = trim($validated['name'] ?? '');

        if ($name === '') {
            return [null, null];
        }

        $parts = preg_split('/\s+/', $name) ?: [];
        $firstName = array_shift($parts);
        $lastName = count($parts) > 0 ? implode(' ', $parts) : null;

        return [$firstName, $lastName];
    }

    private function resolveUsername(array $validated): string
    {
        $preferred = trim($validated['username'] ?? '');

        if ($preferred === '') {
            $preferred = trim(Str::before($validated['email'], '@'));
        }

        if ($preferred === '') {
            $preferred = trim($validated['name'] ?? 'user');
        }

        $baseUsername = Str::of($preferred)
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '')
            ->value();

        if ($baseUsername === '') {
            $baseUsername = 'user';
        }

        $username = $baseUsername;
        $suffix = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername.$suffix;
            $suffix++;
        }

        return $username;
    }
}
