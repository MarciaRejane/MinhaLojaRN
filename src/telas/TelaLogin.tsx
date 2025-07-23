import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { realizarLogin } from "../servicos/servicoAutenticacao";
import { salvarToken } from "../servicos/servicosArmazenamento";

//Interface que define a tipagem das props recebidas pelo componente. 
interface TelaLoginProps {
    aoLoginSucesso: () => void;// função que será chamada após login com sucesso
}

export default function TelaLogin({ aoLoginSucesso }: TelaLoginProps) {
     // Estados locais para armazenar o nome, senha, carregamento e mensagens de erro
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');

    //Função que sera chamada quando o usuario clicar no botão "Entrar".
    const lidarComLogin = async () => {
        setCarregando(true);//Mostra o indicador de carregamento
        setMensagemErro('');//limpa mensagens de erros anteriores
        try {
            //Tenta fazer login com os dados fornecidos 
            const resposta = await realizarLogin({ usuario: nomeUsuario, senha: senhaUsuario });
            //Se o login der certo, salva o token no armazenamento local
            await salvarToken(resposta.token);
            //Chama a função para mudar para a tela de produtos.
            aoLoginSucesso();
        } catch (erro: any) {
            //Se algo der errado, mostra a mensagem de erro
            setMensagemErro(erro.message || 'Erro inesperado. Tente novamente.');
        } finally {
            //Finaliza o carregamento, idependente do resultado.
            setCarregando(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Login</Text>
            {/* campo para o nome do ususario */}
            <TextInput
                style={styles.input}
                placeholder="Nome de Usuário"
                value={nomeUsuario}
                onChangeText={setNomeUsuario}
                autoCapitalize="none"
            />

            {/* campo para a senha do ususario */} 
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senhaUsuario}
                onChangeText={setSenhaUsuario}
                secureTextEntry
            />
            {/* Mostra o loading ou o botão de entrar */}
    {carregando ? (        
        <ActivityIndicator size="large" />      
        ) : (        
        <TouchableOpacity         
            style={styles.botao}          
            onPress={lidarComLogin}          
            disabled={!nomeUsuario || !senhaUsuario}        
            >          
            <Text style={styles.textBotao}>Entrar</Text>        
        </TouchableOpacity>     
    )}
     {/* Exibe a mensagem de erro, se houver algum erro. */}
    {mensagemErro ? <Text style={styles.mensagemErro}>{mensagemErro}</Text> : null}

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width:'100%',
        padding:10,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:5,
        marginBottom:10,
    },
    botao: {
        width:'100%',
        padding:15,
        borderRadius:5,
        alignItems:'center',
        marginTop:10,
    },
    textBotao: {
        fontSize:16,
    },
    mensagemErro: {
        marginTop:15,
        textAlign:'center'
    },
});
