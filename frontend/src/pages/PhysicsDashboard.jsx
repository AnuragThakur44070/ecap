import React, { useState, useEffect } from 'react';
import { physicsService } from '../services/physicsService';

const PhysicsDashboard = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await physicsService.getStatus();
            if (data.status === 'success') {
                setStatus(data.data);
            } else {
                setError('Failed to load system status.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        setToggling(true);
        try {
            const data = await physicsService.toggle();
            if (data.status === 'success') {
                setStatus(prev => ({ ...prev, physics_enabled: data.data.physics_enabled }));
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to toggle mode.');
        } finally {
            setToggling(false);
        }
    };

    if (loading && !status) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const isEnabled = status?.physics_enabled;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        Physics Control System
                    </h1>
                    <p className="text-gray-400 text-lg">Advanced Physical Manipulation Interface</p>
                </header>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Status Card */}
                    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-80">
                        <h2 className="text-2xl font-bold mb-6 text-purple-300">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-300">Physics Core</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {isEnabled ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-300">System Integrity</span>
                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-500/20 text-blue-400">
                                    OPTIMAL
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-300">Last Sync</span>
                                <span className="text-sm font-mono text-gray-400">
                                    {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Controls Card */}
                    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-80 flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold mb-8 text-pink-300">Manual Override</h2>

                        <button
                            onClick={handleToggle}
                            disabled={toggling}
                            className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 ${isEnabled
                                ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-400 shadow-purple-500/50 scale-105'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                }`}
                        >
                            <span className={`text-6xl mb-2 transition-transform duration-500 ${toggling ? 'animate-pulse' : ''} ${isEnabled ? 'rotate-180' : ''}`}>
                                🚀
                            </span>
                            <span className="text-xl font-bold uppercase tracking-widest mt-4">
                                {toggling ? 'ENGAGING...' : (isEnabled ? 'DISENGAGE' : 'ENGAGE')}
                            </span>
                        </button>

                        <p className="mt-8 text-gray-500 text-sm italic text-center">
                            Authorized personnel only. <br /> Interactions are logged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicsDashboard;
