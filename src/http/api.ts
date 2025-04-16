import axios from 'axios';
import useTokenStore from '@/store';
import { GetPdfsParams } from '@/types';

const api = axios.create({
    // todo: move this value to env variable.
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (data: { email: string; password: string }) =>
    api.post('/api/users/login', data);

export const register = async (data: { name: string; email: string; password: string }) =>
    api.post('/api/users/register', data);


export const getPdfs = async (params: GetPdfsParams = {}) => {
    return api.get('/api/pdfs', { params });
};

export const getAllPdfs = async (params: GetPdfsParams = {}) => {
    return api.get('/api/pdfs/allPdf', { params });
};

export const createPdf = async (data: FormData) =>
    api.post('/api/pdfs', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
});

export const deletePdf = async (id: string) => api.delete(`/api/pdfs/${id}`);

export const updatePdf = async (id: string, data: FormData) =>
    api.patch(`/api/pdfs/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });