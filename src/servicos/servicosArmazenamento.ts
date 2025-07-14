import AsyncStorage from "@react-native-async-storage/async-storage";

//Define uma chave unica para armazenar token
const CHAVE_TOKEN = '@minhaLojarn:token';

//Salva o token 
export async function salvarToken(token: string): Promise<void> {   
    try{
        await AsyncStorage.setItem(CHAVE_TOKEN, token);
    }catch(erro) {
        console.error('Erro ao salvar token:', erro);
        throw new Error('Problema ao armazenar suas informações de login.');
    }
}

//recupera o token
export async function obterToken(): Promise<string | null> {
    try{
        const token = await AsyncStorage.getItem(CHAVE_TOKEN)
        return token;
    }catch (erro){
        console.error('Erro ao obter token:', erro);
        return null;
    }
}

//Exclui o token
export async function removerToken(): Promise<void> {
    try {
        await AsyncStorage.removeItem(CHAVE_TOKEN);
    }catch (erro){
        console.error('Erro ao remover token:', erro);
    }
}