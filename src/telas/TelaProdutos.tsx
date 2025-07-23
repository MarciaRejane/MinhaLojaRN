import React, { useState, useEffect } from "react";
import { View, Text,FlatList, ActivityIndicator, TextInput,TouchableOpacity, Image, StyleSheet } from "react-native";
import { obterTodosProdutos } from "../servicos/servicosProdutos";
import { ProdutoAPI } from "../tipos/api";

//Define as props esperadas pelo componente.
interface TelaProdutosProps {
    aoLogout: () => void;
}


export default function TelaProdutos({ aoLogout}: TelaProdutosProps){
     // Estados para armazenar os produtos, produtos filtrados, estado de carregamento, erro e termo de busca
    const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [mensagemErro, setMensagemErro] = useState('');
    const [termoBusca, setTermoBusca] = useState('');

    
    //Carrega os produtos quando abrir a tela.
    useEffect(() => {
        const carregarProdutos = async () => {
            setCarregandoProdutos(true);
            setMensagemErro('');
            try {
                const produtos =await obterTodosProdutos();
                setListaProdutos(produtos);
                setProdutosFiltrados(produtos);
            }catch (erro: any){
                //Define a mensagem de erro para mostrar na tela
                setMensagemErro(erro.message || 'Não foi possivel carregar os produtos.');
                // Se o erro indicar sessão expirada, faz logout automaticamente
                if (erro.message.includes(`Sessão expirada`)) {
                    aoLogout();
                }
            } finally{
                setCarregandoProdutos(false);
            }
        };

        carregarProdutos();
    }, [aoLogout]);

    
    // Filtra os produtos quando o termo de busca ou lista mudar
    useEffect(() => {
        if (termoBusca === '') {
            setProdutosFiltrados(listaProdutos);
        } else {
            const produtosEncontrados = listaProdutos.filter(produto => 
                produto.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
                produto.category.toLowerCase().includes(termoBusca.toLowerCase())
            );
            setProdutosFiltrados(produtosEncontrados);
        }
    }, [termoBusca, listaProdutos]);
        
    
        // Função para renderizar cada item da lista
    const renderizarItemProduto = ({ item }: {item: ProdutoAPI}) => (
        <View style={styles.itemProduto}>
            <Image source={{uri:item.image}} style={styles.imagemProduto}/>
            <View style={styles.detalhesProduto}>
                <Text style={styles.tituloProduto}>{item.title}</Text>
                <Text style={styles.categoriaProduto}>{item.category}</Text>
                <Text style={styles.precoProduto}>R$ {item.price.toFixed(2)}</Text>
            </View>
        </View>
    );

        // Exibe loading enquanto carrega os produtos
    if (carregandoProdutos){
        return(
            <View style={styles.containerCentral}>
                <ActivityIndicator size="large"/>
                <Text>Carregando produtos...</Text>
            </View>
        );
    }

    
    // Se ocorrer um erro, exibe a mensagem e um botão de logout
    if(mensagemErro){
        return(
            <View style={styles.containerCentral}>
                <Text style={styles.mensagemErro}>{mensagemErro}</Text>
                <TouchableOpacity style={styles.botaoLogout} onPress={aoLogout}>
                    <Text style={styles.textoBotao}>Fazer Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

      // Renderiza a interface principal com barra de busca e lista de produtos
    return(
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <Text style={styles.tituloPagina}>Produtos</Text>
                <TouchableOpacity style={styles.botaoLogout} onPress={aoLogout}>
                   <Text style={styles.textoBotao}>Sair</Text> 
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.inputBusca}
                placeholder="Pesquisar produtos..."
                value={termoBusca}
                onChangeText={setTermoBusca}
            />

            <FlatList
                data={produtosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarItemProduto}
                contentContainerStyle={styles.listaConteudo}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop:50,
        paddingHorizontal:10
    },
    containerCentral:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:20
    },
    cabecalho:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:20,
    },
    tituloPagina:{
        fontSize:26,
    },
    botaoLogout:{
        paddingVertical:8,
        paddingHorizontal:15,
        borderRadius:5
    },
    textoBotao:{
        fontSize: 14
    },
    inputBusca:{
        width:'100%',
        padding:10,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:5,
        marginBottom:15
    },
    itemProduto:{
        flexDirection: 'row',
        padding:15,
        borderWidth:1,
        borderColor:'#eee',
        borderRadius:8,
        marginBottom:10,
        alignItems:'center'
    },
    imagemProduto:{
        width:60,
        height:60,
        borderRadius:5,
        marginRight:15
    },
    detalhesProduto:{
        flex:1
    },
    tituloProduto:{
        fontSize:16,
        marginBottom:5
    },
    categoriaProduto:{
        fontSize:12,
        marginBottom:5,
        opacity:0.7
    },
    precoProduto:{
        fontSize:15,
        fontWeight:'bold'
    },
    listaConteudo:{
        paddingBottom:20
    },
    mensagemErro:{
        textAlign:'center',
        marginBottom:20
    },
})
    



