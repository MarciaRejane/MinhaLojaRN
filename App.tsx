
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaLogin from "./src/telas/TelaLogin";
import TelaProdutos from './src/telas/TelaProdutos';
import TelaDetalhesProduto from "./src/telas/TelaDetalhesProduto";
import { obterToken, removerToken } from "./src/servicos/servicosArmazenamento";
import api from './src/api/axiosConfig';

const Pilha = createNativeStackNavigator();

export default function App() {
  // Estado que indica se o usuário está autenticado
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  //Estado que controla se a verificação inicial ainda esta carregando.
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  //Verifica se há um token salvo ao iniciar o app
  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        // Se encontrou o token, define o cabeçalho padrão do Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAutenticado(true);
      } else {
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
  if (carregandoInicial) {
    return (
      <View style={styles.containerCentral}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator
        screenOptions={{ headerShown: false }}>
        {autenticado ? (
          //Telas acessiveis após o login
          <Pilha.Group>
            <Pilha.Screen
              name="Produtos"
              options={{ title: "Lista de Produtos" }}>
              {(props) => <TelaProdutos {...props} aoLogout={lidarComLogout} />}
            </Pilha.Screen>
            <Pilha.Screen
              name="DetalhesProduto"
              options={{ title: "Detalhes do Produto" }}>
              {(props) => <TelaDetalhesProduto {...props} />}
            </Pilha.Screen>
          </Pilha.Group>
        ) : (
          //Telas acessiveis antes do login
          <Pilha.Group>
            <Pilha.Screen
              name="Login"
              options={{ title: "Entrar" }}>
              {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)} />}
            </Pilha.Screen>
          </Pilha.Group>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  containerCentral: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
