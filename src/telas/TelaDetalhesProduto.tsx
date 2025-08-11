import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { obterProdutoPorId } from "../servicos/servicosProdutos";
import { ProdutoAPI } from "../tipos/api";

type DetalhesProdutoRotaParametros = {
    produtoId: number;
}


export default function TelaDetalhesProduto() {
    const rota = useRoute();
    const navegacao = useNavigation();
    const { produtoId } = rota.params as DetalhesProdutoRotaParametros;

    const [produto, setProduto] = useState<ProdutoAPI | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        const carregarDetalhesProduto = async () => {
            setCarregando(true);
            setMensagemErro("");
            try {
                const produtoEncontrado = await obterProdutoPorId(produtoId);
                setProduto(produtoEncontrado);
            } catch (erro: any) {
                setMensagemErro(
                    erro.message || "Não foi possível carregar os detalhes do produto."
                );
            } finally {
                setCarregando(false);
            }
        };
        carregarDetalhesProduto();
    }, [produtoId]); //Recarrega se o ID do produto mudar

    if (carregando) {
        return (
            <View style={styles.containerCentral}>
                <ActivityIndicator size="large" />
                <Text>Carregando detalhes do produto...</Text>
            </View>
        );
    }

    if (mensagemErro) {
        return (
            <View style={styles.containerCentral}>
                <Text style={styles.mensagemErro}>{mensagemErro}</Text>
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navegacao.goBack()}
                >

                    <Text style={styles.textoBotao}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!produto) {
        return (
            <View style={styles.containerCentral}>
                <Text>Produto não encontrado</Text>
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navegacao.goBack()}
                >
                    <Text style={styles.textoBotao}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navegacao.goBack()}
            >
                <Text style={styles.textoBotao}>{"< Voltar"}</Text>
            </TouchableOpacity>
            <Image source={{ uri: produto.image }} style={styles.imagemProduto} />
            <Text style={styles.titulo}>{produto.title}</Text>
            <Text style={styles.preco}>R$ {produto.price.toFixed(2)}</Text>
            <Text style={styles.categoria}>{produto.category}</Text>
            <Text style={styles.descricaoTitulo}>Descrição:</Text>
            <Text style={styles.descricao}>{produto.description}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingTexto}>Avaliação: {produto.rating.rate} ({produto.rating.count} votos)</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    containerCentral: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    botaoVoltar: {
        alignSelf: "flex-start",
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
    },
    textoBotao: {
        fontSize: 16,
        color: "#333",
    },
    imagemProduto: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
        marginBottom: 10,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    preco: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#e67e22",
        marginBottom: 10,
    },
    categoria: {
        fontSize: 16,
        color: "#666",
        marginBottom: 15,
    },
    descricaoTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 5,
    },
    descricao: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    ratingTexto: {
        fontSize: 16,
        color: "#3498db",
        fontWeight: "bold",
    },
    mensagemErro: {
        textAlign: "center",
        marginBottom: 20,
        color: "red",
        fontSize: 16,
    },
});

