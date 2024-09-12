function getLocalStorage(tabela) {
    // Verifica se os dados existem no localStorage
    let data_produtos = localStorage.getItem("produtos");
    let data_clientes = localStorage.getItem("clientes");

    if (!data_produtos || !data_clientes) {
        // Se algum dos dados não existir, define os dados padrão
        setLocalStorage();
        // Recarrega os dados após definir o padrão
        data_produtos = localStorage.getItem("produtos");
        data_clientes = localStorage.getItem("clientes");
    }

    const produtos = JSON.parse(data_produtos);
    const clientes = JSON.parse(data_clientes);

    // Retorna os dados conforme a tabela solicitada
    if (tabela === 'produtos') {
        return produtos;
    } else if (tabela === 'clientes') {
        return clientes;
    }
}

function setLocalStorage() {
    // Dados padrão para produtos e clientes
    const produtos = [
        { id_produto: 1, nome_produto: 'gas', desc_produto: 'botijão de gás de 13kg', quantidade_disponivel: 5, preco_produto: 2, nivel_abastecimento: 3, imagem_produto: "/img/gas.jpg" },
        { id_produto: 5, nome_produto: 'prego', desc_produto: 'prego fino de aço', quantidade_disponivel: 44, preco_produto: 200, nivel_abastecimento: 4, imagem_produto: "/img/prego.jpg"},
        { id_produto: 7, nome_produto: 'agua', desc_produto: 'galão de água 20 L', quantidade_disponivel: 14, preco_produto: 10, nivel_abastecimento: 5, imagem_produto: "/img/galao.png"},
        { id_produto: 2, nome_produto: 'agua', desc_produto: 'galão de água 20 L', quantidade_disponivel: 14, preco_produto: 10, nivel_abastecimento: 5, imagem_produto: "/img/galao.png"},
        { id_produto: 3, nome_produto: 'agua', desc_produto: 'galão de água 20 L', quantidade_disponivel: 14, preco_produto: 10, nivel_abastecimento: 5, imagem_produto: "/img/galao.png"},
        { id_produto: 4, nome_produto: 'agua', desc_produto: 'galão de água 20 L', quantidade_disponivel: 14, preco_produto: 10, nivel_abastecimento: 5, imagem_produto: "/img/galao.png"}


    ];
    
    const clientes = [
        { id_cliente: 7, nome_cliente: 'amanda', telefone_cliente: '31991882338', rua_cliente: 'Cícero Lamartine', numero_cliente: '618', id_bairro: 1 },
        { id_cliente: 8, nome_cliente: 'amanda', telefone_cliente: '31991882338', rua_cliente: 'Cícero Lamartine', numero_cliente: '618', id_bairro: 1 },
        { id_cliente: 9, nome_cliente: 'joaa', telefone_cliente: '44433', rua_cliente: 'ffdfd', numero_cliente: '3', id_bairro: 1 }
    ];

    const bairros = [
        { id_bairro: 1, nome_bairro: "cruzeiro", frete_bairro: "5"}
    ];

    const cart = [];

    const nota_venda = [];

    const item_nota_venda = [];

    // Define os dados no localStorage
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('bairros', JSON.stringify(bairros));
    localStorage.setItem('nota_venda', JSON.stringify(nota_venda));
    localStorage.setItem('item_nota_venda', JSON.stringify(item_nota_venda));
}

// Chama a função para garantir que os dados estejam no localStorage
getLocalStorage("produtos");
getLocalStorage("clientes");
