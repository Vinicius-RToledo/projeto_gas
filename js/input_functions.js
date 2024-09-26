function filtrar_bairro(id_input){
    // Inicializar o filtro de bairros aqui
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
                    searchBairro.value = bairro.nome_bairro;
                    document.getElementById('id_bairro').value = bairro.id_bairro;
                    const frete = document.getElementById('frete');
                    if (frete){
                        frete.value = bairro.frete_bairro || '';
                    }
                    listaBairros.innerHTML = '';
                    listaBairros.style.display = 'none';
                });

                listaBairros.appendChild(li);
            }
        });

        listaBairros.style.display = hasResults ? 'block' : 'none';
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
                    // atualiza a modal do html para preencher corretamente 
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
                    const bairros = JSON.parse(localStorage.getItem('bairros')) || []; // Supondo que você tenha os bairros no localStorage
                    const bairroSelecionado = bairros.find(bairro => bairro.id_bairro === cliente.id_bairro);
                    if (bairroSelecionado) {
                        document.getElementById('frete').value = bairroSelecionado.frete_bairro || ''; // Adicionando o frete
                        const searchBairro = document.getElementById('input-bairro'); // Ajuste para o ID correto
                        searchBairro.value = bairroSelecionado.nome_bairro;
                        console.log("Bairro Selecionado:", searchBairro, "ID:", bairroSelecionado.id_bairro);
                    }

                    listaClientes.innerHTML = '';
                    listaClientes.style.display = 'none';
                });

                listaClientes.appendChild(li);
            }
        });

        listaClientes.style.display = hasResults ? 'block' : 'none';
    });
}

