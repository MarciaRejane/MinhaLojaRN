import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import TelaLogin from "./src/telas/TelaLogin";
import TelaProdutos from './src/telas/TelaProdutos';
import { obterToken, removerToken } from "./src/servicos/servicosArmazenamento";
import api from './src/api/axiosConfig';

export default function App() {
   // Estado que indica se o usuário está autenticado
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  //Estado que controla se a verificação inicial ainda esta carregando.
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  //Verifica se há um token salvo ao iniciar o app
  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token){
         // Se encontrou o token, define o cabeçalho padrão do Axios
        api.defaults.headers.common['Authorization'] =`Bearer ${token}`;
        setAutenticado(true);
      }else {
        setAutenticado(false);// Não há token, precisa fazer login
      }
      setCarregandoInicial(false);// Finaliza o carregamento inicial
    };

    verificarAutenticacao()
  }, []);
  // Função chamada quando o usuário faz logout
  const lidarComLogout = async () => {
    await removerToken();// Remove o token salvo
    delete api.defaults.headers.common['Authorization']; // Remove o token do Axios
    setAutenticado(false);// Atualiza estado para voltar à tela de login
  };
  // Exibe um indicador de carregamento enquanto verifica autenticação
  if (carregandoInicial){
    return (
      <View style={styles.containerCentral}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
// Se autenticado, mostra a tela de produtos com opção de logout
  if (autenticado) {
    return <TelaProdutos aoLogout={lidarComLogout}/>;
  } else {
    return <TelaLogin aoLoginSucesso={() => setAutenticado(true)}/>
  }
}

const styles = StyleSheet.create({
  containerCentral: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
});
