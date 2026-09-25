import api from './api';

export const assetService = {
  getUploadSignature: async (filename: string, content_type: string) => {
    const response = await api.get('/assets/upload-signature', {
      params: { filename, content_type }
    });
    return response.data;
  },
  
  uploadToS3: async (uploadUrl: string, file: File) => {
    // Note: Use standard axios or fetch here to avoid our API interceptor modifying headers
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    return response;
  },

  saveMetadata: async (data: { file_key: string, url: string, type: string, size: number }) => {
    const response = await api.post('/assets/metadata', data);
    return response.data;
  },
  
  getAssets: async (page = 1, limit = 10, type?: string) => {
    const response = await api.get('/assets/', {
      params: { page, limit, type }
    });
    return response.data;
  }
};
