function filtrar_bairro(){
    // Inicializar o filtro de bairros aqui
    const searchBairro = document.getElementById('search-bairro');
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
                    searchCliente.value = cliente.nome_cliente;
                    document.getElementById('id_cliente').value = cliente.id_cliente; // Supondo que o ID do cliente está em cliente.id_cliente
                    listaClientes.innerHTML = '';
                    listaClientes.style.display = 'none';
                });

                listaClientes.appendChild(li);
            }
        });

        listaClientes.style.display = hasResults ? 'block' : 'none';
    });
}
