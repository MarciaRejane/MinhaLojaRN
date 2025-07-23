import api from '../api/axiosConfig';
import { ProdutoAPI } from '../tipos/api';

// Função assíncrona para buscar todos os produtos da API
export async function obterTodosProdutos(): Promise<ProdutoAPI[]>{
    try{
        // Faz uma requisição GET para o endpoint products e espera a resposta tipada.
        const resposta = await api.get<ProdutoAPI[]>('products');
        //Retorna od dados da resposta 
        return resposta.data;
    }catch (erro: any) {
    // se der erro, lança uma nova exceção com a mensagem do erro ou uma mensagem padrão.
        throw new Error(erro.message || 'Erro ao buscar produtos');
    }
}
