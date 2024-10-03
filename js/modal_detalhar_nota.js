async function detalharVenda(idNotaVenda) {
    // Recuperar os dados da venda
    const bairros = JSON.parse(localStorage.getItem("bairros")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Chamar a função para buscar os itens da venda
    const itens = await buscarItensVenda(idNotaVenda);
    if (!itens) {
        console.error('Itens não encontrados');
        return; // Para de executar se não encontrar os itens
    }

    const cartItemsList = document.getElementById('cart-items-detalhar');
    cartItemsList.innerHTML = ''; // Limpa a lista existente

    let subtotal = 0; // Inicializa o subtotal

    itens.forEach(item => {
        // Encontra o produto correspondente
        const produto = produtos.find(p => p.id_produto === item.id_produto);
        if (produto) {
            const valorUnitario = produto.preco_produto;
            const valorTotal = valorUnitario * item.quantidade_item;
            subtotal += valorTotal; // Acumula o subtotal

            const listItem = document.createElement('li');
            listItem.className = 'collection-item';
            listItem.innerHTML = `
                ${produto.desc_produto} - 
                R$${valorUnitario.toFixed(2)} x ${item.quantidade_item} = R$${valorTotal.toFixed(2)}
            `;
            cartItemsList.appendChild(listItem);
        }
    });

    const venda = await buscarDadosVenda(idNotaVenda);
    if (!venda) {
        console.error('Venda não encontrada');
        return; // Para de executar se não encontrar a venda
    }

    // Busca o bairro correspondente à venda
    const bairro = bairros.find(b => b.id_bairro === venda.id_bairro_entrega);
    const totalFrete = bairro ? bairro.frete_bairro : 0; // Se o bairro não for encontrado, assume frete 0
    const totalVenda = venda.valor_total - totalFrete;

    // Busca cliente da venda
    const cliente = clientes.find(c => c.id_cliente === venda.id_cliente);
    const nome_cliente = cliente ? cliente.nome_cliente : '';

    // Preencher os campos da modal com os dados da venda
    document.getElementById('nome_cliente_detalhar').value = nome_cliente;
    document.getElementById('telefone_cliente_detalhar').value = venda.telefone_entrega;
    document.getElementById('bairro_detalhar').value = bairro.nome_bairro;
    document.getElementById('rua_detalhar').value = venda.rua_entrega;
    document.getElementById('numero_detalhar').value = venda.numero_entrega;
    document.getElementById('frete-detalhar').textContent = totalFrete.toFixed(2);
    document.getElementById('subtotal-itens-detalhar').textContent = totalVenda.toFixed(2);
    document.getElementById('subtotal-detalhar').textContent = venda.valor_total.toFixed(2);
    document.getElementById('observacoes_detalhar').value = venda.observacoes || '';

    // Atualiza os campos de texto da modal após preencher
    M.updateTextFields();

    // Abrir o modal
    const modalDetalhar = M.Modal.getInstance(document.getElementById('detalhar-venda'));
    modalDetalhar.open();
}

async function buscarDadosVenda(idNotaVenda) {
    try {
        // Chamar a função CRUD_API para buscar os dados da venda
        const venda = await CRUD_API('notas-venda', 'GET', idNotaVenda);

        // Certifique-se de que a venda foi encontrada antes de retornar
        if (!venda) {
            throw new Error('Venda não encontrada');
        }

        console.log(venda); // Para verificar os dados recebidos
        return venda; // Retorna os dados da venda
    } catch (error) {
        console.error('Erro ao buscar dados da venda:', error);
        return null; // Retorna null se houver um erro
    }
}

async function buscarItensVenda(idNotaVenda) {
    try {
        const nota = {
            id_nota_venda: idNotaVenda
        }
        // Chamar a função CRUD_API para buscar os itens da venda
        const itens = await CRUD_API('itens-da-nota', 'POST', null, nota);

        // Certifique-se de que os itens foram encontrados antes de retornar
        if (!itens) {
            throw new Error('Itens da venda não encontrados');
        }

        console.log(itens); // Para verificar os dados recebidos
        return itens; // Retorna os dados dos itens da venda
    } catch (error) {
        console.error('Erro ao buscar itens da venda:', error);
        return null; // Retorna null se houver um erro
    }
}