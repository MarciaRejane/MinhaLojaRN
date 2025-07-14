import api from '../api/axiosConfig';
//importa os interfaces de tipos/api.ts
import { CredenciaisLogin, RespostaLoginAPI } from '../tipos/api';

export async function realizarLogin(credenciais: CredenciaisLogin):
 Promise<RespostaLoginAPI> {
  try {
     // Faz uma requisição POST para o endpoint 'auth/login' da Fake Store API
    const resposta = await api.post<RespostaLoginAPI>('auth/login', {
      username: credenciais.Usuario,
      password: credenciais.senha,
    });
    return resposta.data;
  } catch (erro: any) {
    //Se a resposta for um erro, ele mostra 401. e a mensagem
    if (erro.response && erro.response.status === 401) {
      throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
    }
    //mostra que tem algum erro de conexão com o servidor.
    throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
  }
}