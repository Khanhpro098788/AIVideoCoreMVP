import api from './api';

export const videoService = {
  renderVideo: async (avatar_asset_id: string, voice_asset_id: string) => {
    const response = await api.post('/videos/render', {
      avatar_asset_id,
      voice_asset_id
    });
    return response.data; // { task_id, status: 'pending', message: 'Task queued' }
  },
  
  getTaskStatus: async (taskId: string) => {
    const response = await api.get(`/videos/${taskId}/status`);
    return response.data; 
    // { status, current_chunk, total_chunks, progress_percent, result_url }
  },
  
  getHistory: async (page = 1, limit = 10, status?: string) => {
    const response = await api.get('/videos/', {
      params: { page, limit, status }
    });
    return response.data;
  }
};
