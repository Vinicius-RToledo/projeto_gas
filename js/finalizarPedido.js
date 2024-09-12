


function Script_da_modal_finalizar(){
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

        // Preencher o campo select com clientes do localStorage
        const selectCliente = document.getElementById('select-cliente');


        // Preencher o select com os clientes
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente;
            option.textContent = cliente.nome_cliente;
            selectCliente.appendChild(option);
        });

        // Inicializar o select do Materialize
        M.FormSelect.init(selectCliente);

        // Preencher o campo select de bairros do localStorage
        const selectBairro = document.getElementById('select-bairro');
        bairros.forEach(bairro => {
            const option = document.createElement('option');
            option.value = bairro.id_bairro;
            option.textContent = `${bairro.nome_bairro} - Frete: R$${bairro.frete_bairro}`;
            selectBairro.appendChild(option);
        });
        M.FormSelect.init(selectBairro); // Inicializar o select do Materialize

        // Evento para preencher o formulário ao selecionar um cliente
        selectCliente.addEventListener('change', function () {
            const clienteSelecionado = clientes.find(cliente => parseInt(cliente.id_cliente) === parseInt(this.value));
            console.log("Cliente selecionado:", clienteSelecionado);

            if (clienteSelecionado) {
                document.getElementById('rua').value = clienteSelecionado.rua_cliente || '';
                document.getElementById('numero').value = clienteSelecionado.numero_cliente || '';
                document.getElementById('telefone').value = clienteSelecionado.telefone_cliente || '';

                // Encontrar o bairro correspondente ao id_bairro do cliente
                const bairroSelecionado = bairros.find(bairro => bairro.id_bairro === clienteSelecionado.id_bairro);
                if (bairroSelecionado) {
                    selectBairro.value = bairroSelecionado.id_bairro;
                    M.FormSelect.init(selectBairro); // Re-inicializar o select para refletir a seleção
                }

                M.updateTextFields(); // Atualizar os campos do Materialize
            }
        });
    });
}


function confirmarVenda(){
    console.log("cheguei aqui");
}