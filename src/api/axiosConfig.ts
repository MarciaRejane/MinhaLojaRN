import axios from 'axios';
import { obterToken, removerToken } from '../servicos/servicosArmazenamento';

const api = axios.create({
    baseURL:'https://fakestoreapi.com/', 
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json'
    },
});

//Interceptor de requisição: Adiciona o token
api.interceptors.request.use(
    async (config) => {
        const token = await obterToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (erro) => {
        return Promise.reject(erro);
    }
);

//Interceptor de resposta
api.interceptors.response.use(
    (response) => response,
    async(erro) => {
        if(erro.response && erro.response.status === 401) {
            await removerToken();
            console.warn('Token de autenticação expirado ou invalido. Realize o login novamente');
        }
        return Promise.reject(erro);
    }
);
export default api;
