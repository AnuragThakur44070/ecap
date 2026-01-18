<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Exception;

class PhysicsExceptionTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        // Since I cannot migrate in this environment, I'll mock DB calls if possible 
        // or rely on RefreshDatabase if sqlite works (it might not without php).
        // This test file serves as a verification artifact for the user.
    }

    /** @test */
    public function it_returns_consistent_json_on_api_exception()
    {
        // Define a route that throws an exception
        \Illuminate\Support\Facades\Route::get('api/test-exception', function () {
            throw new Exception("Simulated critical failure", 500);
        });

        $response = $this->getJson('api/test-exception');

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'Simulated critical failure',
                'code' => 500
            ]);
    }

    /** @test */
    public function controller_handles_database_exceptions_gracefully()
    {
        // Mock DB facade to throw exception
        DB::shouldReceive('table')
            ->andThrow(new Exception("Database connection lost"));

        $response = $this->getJson('/api/physics/status');

        $response->assertStatus(500)
            ->assertJson([
                'status' => 'error',
                'message' => 'Failed to retrieve system status.',
                'error' => 'Database connection lost'
            ]);
    }

    /** @test */
    public function validation_errors_return_json_422()
    {
        $response = $this->putJson('/api/physics/config', [
            // Missing key and value
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'message',
                'errors'
            ]);
    }
}
