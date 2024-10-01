function filtrar_bairro(id_input) {
    // Inicializar o filtro de bairros
    const searchBairro = document.getElementById(id_input);
    const listaBairros = document.getElementById('lista-bairros');

    searchBairro.addEventListener('keyup', (e) => {
        const searchTerm = searchBairro.value.toLowerCase();
        const bairros = JSON.parse(localStorage.getItem('bairros')) || [];
        listaBairros.innerHTML = '';

        let hasResults = false;
        bairros.forEach(bairro => {
            if (bairro.nome_bairro.toLowerCase().includes(searchTerm)) {
                hasResults = true;
                const li = document.createElement('li');
                li.textContent = bairro.nome_bairro;

                li.addEventListener('click', () => {
                    // Preenche o input com o nome do bairro selecionado
                    searchBairro.value = bairro.nome_bairro;
                    // Preenche o campo oculto com o id do bairro
                    document.getElementById('id_bairro').value = bairro.id_bairro;

                    // Se houver o campo de frete, preencha-o
                    const frete = document.getElementById('frete');
                    if (frete) {
                        frete.value = bairro.frete_bairro || '';
                    }

                    // Esconde a lista de bairros
                    listaBairros.innerHTML = '';
                    listaBairros.style.display = 'none';
                });

                listaBairros.appendChild(li);
            }
        });

        listaBairros.style.display = hasResults ? 'block' : 'none';
    });

    // Esconde a lista ao clicar fora do campo de input ou da lista
    document.addEventListener('click', (event) => {
        const isClickInside = searchBairro.contains(event.target) || listaBairros.contains(event.target);
        if (!isClickInside) {
            listaBairros.style.display = 'none';
        }
    });
}


function filtrar_cliente() {
    const searchCliente = document.getElementById('search-cliente');
    const listaClientes = document.getElementById('lista-clientes');

    searchCliente.addEventListener('keyup', (e) => {
        const searchTerm = searchCliente.value.toLowerCase();
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        listaClientes.innerHTML = '';

        let hasResults = false;
        clientes.forEach(cliente => {
            if (cliente.nome_cliente.toLowerCase().includes(searchTerm)) {
                hasResults = true;
                const li = document.createElement('li');
                li.textContent = cliente.nome_cliente;

                li.addEventListener('click', () => {
                    // Atualiza a modal do HTML para preencher corretamente
                    $(document).ready(function () {
                        M.updateTextFields();
                    });

                    // Preencher os inputs com os dados do cliente selecionado
                    searchCliente.value = cliente.nome_cliente;
                    document.getElementById('id_cliente').value = cliente.id_cliente;

                    // Preencher outros campos do formulário
                    document.getElementById('rua').value = cliente.rua_cliente || '';
                    document.getElementById('numero').value = cliente.numero_cliente || '';
                    document.getElementById('telefone').value = cliente.telefone_cliente || '';

                    // Encontrar o bairro correspondente ao id_bairro do cliente
                    const bairros = JSON.parse(localStorage.getItem('bairros')) || [];
                    const bairroSelecionado = bairros.find(bairro => bairro.id_bairro === cliente.id_bairro);
                    if (bairroSelecionado) {
                        document.getElementById('frete').value = bairroSelecionado.frete_bairro || ''; // Adicionando o frete
                        const searchBairro = document.getElementById('input-bairro');
                        const IDBairro = document.getElementById('id_bairro');

                        searchBairro.value = bairroSelecionado.nome_bairro;
                        IDBairro.value = bairroSelecionado.id_bairro;
                    }

                    listaClientes.innerHTML = '';
                    listaClientes.style.display = 'none';
                });

                listaClientes.appendChild(li);
            }
        });

        listaClientes.style.display = hasResults ? 'block' : 'none';
    });

    // Esconder a lista de clientes ao clicar fora do campo de busca e da lista
    document.addEventListener('click', (event) => {
        const isClickInside = searchCliente.contains(event.target) || listaClientes.contains(event.target);
        if (!isClickInside) {
            listaClientes.style.display = 'none';
        }
    });
}


