import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:6154',
});

// Interceptor para tratar erros de token expirado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o token expirou (401 ou erro de token)
        if (error.response?.status === 401 || 
            error.message?.includes('Token') || 
            error.message?.includes('expired')) {
            // Limpar token e usuário do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Limpar header de autorização
            delete api.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
    }
);
