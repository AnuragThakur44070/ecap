<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PhysicsController extends Controller
{
    /**
     * Get the current system status.
     */
    public function status()
    {
        try {
            $config = DB::table('system_configurations')
                ->where('key', 'physics_enabled')
                ->first();

            $status = $config ? filter_var($config->value, FILTER_VALIDATE_BOOLEAN) : false;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'physics_enabled' => $status,
                    'system_optimal' => true,
                    'timestamp' => now()->toIso8601String(),
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve system status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle the physics mode.
     */
    public function toggle(Request $request)
    {
        try {
            // Validate input just in case, though toggle is simple
            $targetState = $request->input('enabled');
            
            // If explicit state not provided, flip current
            if ($targetState === null) {
                $current = DB::table('system_configurations')
                    ->where('key', 'physics_enabled')
                    ->first();
                $targetState = $current ? !filter_var($current->value, FILTER_VALIDATE_BOOLEAN) : true;
            }

            DB::table('system_configurations')->updateOrInsert(
                ['key' => 'physics_enabled'],
                [
                    'value' => $targetState ? 'true' : 'false',
                    'updated_at' => now(),
                    'created_at' => now() // only used on insert
                ]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Physics mode ' . ($targetState ? 'enabled' : 'disabled'),
                'data' => [
                    'physics_enabled' => (bool)$targetState
                ]
            ], 200);

        } catch (Exception $e) {
             return response()->json([
                'status' => 'error',
                'message' => 'Failed to toggle physics mode.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update configuration.
     */
    public function updateConfig(Request $request)
    {
        try {
            $validated = $request->validate([
                'key' => 'required|string',
                'value' => 'required|string',
            ]);

            DB::table('system_configurations')->updateOrInsert(
                ['key' => $validated['key']],
                ['value' => $validated['value'], 'updated_at' => now()]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Configuration updated successfully.',
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
             return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
             return response()->json([
                'status' => 'error',
                'message' => 'Failed to update configuration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
