import api from '../api/axios';

export const physicsService = {
    getStatus: async () => {
        try {
            const response = await api.get('/physics/status');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggle: async (enabled = null) => {
        try {
            const payload = enabled !== null ? { enabled } : {};
            const response = await api.post('/physics/toggle', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateConfig: async (key, value) => {
        try {
            const response = await api.put('/physics/config', { key, value });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
