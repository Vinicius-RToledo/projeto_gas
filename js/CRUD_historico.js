async function filtrarVendas() {
    const dataInicio = document.getElementById("data-inicio").value; // Obter data de início
    const dataFim = document.getElementById("data-fim").value; // Obter data de fim

    // Função para converter data do formato MM/DD/YYYY para YYYY-MM-DD
    function converterData(data) {
        const partes = data.split("/");
        if (partes.length === 3) {
            // Verifica se o formato está correto
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        return data; // Retorna a data original se não estiver no formato esperado
    }

    // Convertendo as datas para o formato correto
    const dataInicioFormatada = converterData(dataInicio);
    const dataFimFormatada = converterData(dataFim);

    const dados = {
        data_inicio: dataInicioFormatada,
        data_fim: dataFimFormatada
    };

    console.log(dados);

    try {
        // Chamar a função CRUD_API para fazer a requisição
        const vendas = await CRUD_API('filtrar-vendas/listar_vendas_periodo', 'POST', null, dados);

        // Verifica se retornou vendas
        if (vendas && Array.isArray(vendas)) {
            popularTabela(vendas);
        } else {
            console.warn('Nenhuma venda encontrada para o período informado.');
            popularTabela([]); // Limpar a tabela se não houver vendas
        }
    } catch (error) {
        console.error('Erro ao filtrar vendas:', error);
    }
}

function popularTabela(vendas) {
    clientes = JSON.parse(localStorage.getItem("clientes"));

    function getNomeCliente(idCliente) {
        const clienteEncontrado = clientes.find(cliente => cliente.id_cliente === idCliente);
        return clienteEncontrado ? clienteEncontrado.nome_cliente : 'N/A'; // Retorna 'N/A' se não encontrar
    }

    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de adicionar novas linhas

    vendas.forEach(venda => {
        const nome_cliente = getNomeCliente(venda.id_cliente);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${venda.id_nota_venda}</td>
            <td>${nome_cliente || 'N/A'}</td>
            <td>${new Date(venda.data_nota_venda).toLocaleDateString('pt-BR')}</td>
            <td>${venda.hora_nota_venda || 'N/A'}</td>
            <td>${venda.rua_entrega || 'N/A'}</td>
            <td>${venda.telefone_entrega || 'N/A'}</td>
            <td>${venda.valor_total.toFixed(2)}</td>
            <td>
                <a class="table-icons waves-effect waves-light btn-small modal-trigger" 
                id="btns-home" 
                data-target="detalhar-venda" 
                onclick="detalharVenda(${venda.id_nota_venda})">
                    <i class="material-icons venda-icon">visibility</i>
                </a>
            </td>
        `;
        tabelaCorpo.appendChild(row);
    });
}