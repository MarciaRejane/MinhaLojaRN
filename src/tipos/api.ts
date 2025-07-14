export interface CredenciaisLogin{
    Usuario: string;
    senha: string;

}

//Exemplo ficticio da credenciais 
const credenciaisLogin: CredenciaisLogin = {
    Usuario: 'Ana Alice',
    senha: 'ana123'
};

//Define o formato da resposta da API de login
export interface RespostaLoginAPI {
    token: string; //Token JWT retornado após login ter dado certo.
}
const respostaLoginAPI: RespostaLoginAPI ={
    token: "200"// Exemplo ficticio do token
};

export interface ProdutoAPI {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
    
}
const produtoAPI: ProdutoAPI = {
    id: 1,
    title: "Camisa",
    price: 230.50,
    description: "Camisa de algodão unissex",
    category: "roupas",
    image: "https://fakestoreapi.com/img/camisa.jpg",
    rating: {
        rate: 4.5,
        count:87
    }
    
};
