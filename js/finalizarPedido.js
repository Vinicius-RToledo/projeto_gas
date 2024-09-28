


async function Script_da_modal_finalizar(){
    document.addEventListener('DOMContentLoaded', function () {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const bairros = JSON.parse(localStorage.getItem('bairros')) || [];

        // Preenche a modal com os produtos do carrinho
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const cartItemsList = document.getElementById('cart-items');
        const subtotalElement = document.getElementById('subtotal');

        let subtotal = 0;
        cartItemsList.innerHTML = ''; // Limpa a lista existente

        cart.forEach(item => {
            // Encontra o produto correspondente
            const produto = produtos.find(p => p.id_produto === item.produto.id_produto);
            if (produto) {
                const valorUnitario = produto.preco_produto;
                const valorTotal = valorUnitario * item.quantidade_cart;
                subtotal += valorTotal;

                const listItem = document.createElement('li');
                listItem.className = 'collection-item';
                listItem.innerHTML = `
            ${produto.desc_produto} - 
            R$${valorUnitario.toFixed(2)} x ${item.quantidade_cart} = R$${valorTotal.toFixed(2)}
        `;
                cartItemsList.appendChild(listItem);
            }
        });

        // Atualiza o subtotal na modal
        subtotalElement.textContent = subtotal.toFixed(2);        


    });
}


async function confirmarPedido(event) {
    event.preventDefault();
    
    // Recuperar as tabelas do localStorage
    const notas = JSON.parse(localStorage.getItem('nota_venda')) || [];
    const itens = JSON.parse(localStorage.getItem('item_nota_venda')) || [];
    const bairros = JSON.parse(localStorage.getItem('bairros')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Recuperar os dados do cliente selecionado e outros campos
    const id_cliente = parseInt(document.getElementById('id_cliente').value);
    const id_bairro = parseInt(document.getElementById('id_bairro').value);
    const rua_entrega = document.getElementById('rua').value;
    const numero_entrega = document.getElementById('numero').value;
    const telefone_cliente = document.getElementById('telefone').value;

    const bairroSelecionado = bairros.find(bairro => bairro.id_bairro === id_bairro);
    let frete = 0;
    if (bairroSelecionado) {
        frete = bairroSelecionado.frete_bairro;
    }

    let subtotal = 0;

    cart.forEach(item => {
        // Encontra o produto correspondente
        const produto = produtos.find(p => p.id_produto === item.produto.id_produto);
        if (produto) {
            const valorUnitario = produto.preco_produto;
            const valorTotal = valorUnitario * item.quantidade_cart;
            subtotal += valorTotal;
        }
    });

    subtotal += parseFloat(frete);
        
    // Criar o objeto nota_venda
    let novaNotaVenda = {
        id_nota_venda: null,
        valor_total: parseFloat(subtotal),
        data_nota_venda: new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'America/Sao_Paulo' // Ajuste para o fuso horário desejado
        }).split('/').reverse().join('-'), // Converte para o formato 'YYYY-MM-DD'
        id_cliente: id_cliente,
        id_tipo_pagamento: 1,
        id_bairro_entrega: id_bairro,
        rua_entrega: rua_entrega,
        numero_entrega: numero_entrega,
        telefone_entrega: telefone_cliente
    };


    try {
        // Adicionar a nova nota à lista de notas
        novaNotaVenda = await CRUD_API("notas-venda", "POST", null, novaNotaVenda);
        notas.push(novaNotaVenda);

        // Salvar no localStorage
        localStorage.setItem('nota_venda', JSON.stringify(notas));

        const id_nota_venda = novaNotaVenda.id_nota_venda;

        // Criar os objetos item_nota_venda associados a esta nota
        const itensNotaVenda = cart.map((item, index) => {
            return {
                id_item_da_nota: index + 1, // Incrementa o ID do item
                id_nota_venda: id_nota_venda, // Associa ao ID da nota de venda
                id_produto: item.produto.id_produto,
                quantidade_item: item.quantidade_cart
            };
        });

        // Adicionar os itens da nota à lista existente
        itens.push(...itensNotaVenda);

        // Salvar os itens da nota no localStorage
        localStorage.setItem('item_nota_venda', JSON.stringify(itens));

        // Função principal para adicionar todos os itens
        await adicionarItens(itensNotaVenda);

        // Confirmar a ação
        localStorage.removeItem("cart");
        M.toast({html: `Venda cadastrada com sucesso!`, classes: 'green'});

        // Fechar Modal
        const modalInstance = M.Modal.getInstance(document.getElementById('modal-finalizar'));
        if (modalInstance) {
            modalInstance.close();
        }

        // Atualizar a quantidade no HTML para cada produto
        itensNotaVenda.forEach(item => {
            atualizarQuantidadeNoHTML(item.id_produto);
        });

    } catch (error) {
        console.error('Erro ao confirmar o pedido:', error);
    }
}

// Função para adicionar itens
async function adicionarItens(itensNotaVenda) {
    try {
        const promises = itensNotaVenda.map(async (item) => {
            await CRUD_API("itens-nota-venda", "POST", null, item); // Chama a função CRUD_API para cada item
        });
        await Promise.all(promises);
    } catch (error) {
        console.error('Erro ao adicionar itens:', error);
    }
}
