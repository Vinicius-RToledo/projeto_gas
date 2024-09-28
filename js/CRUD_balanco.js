function listaVendasDia() {

    const tabelaBalancoDiario = document.getElementById('table-balanco-diario');
    tabelaBalancoDiario.innerHTML = ''; // Limpa a tabela antes de inserir os novos dados
    const clientes = JSON.parse(localStorage.getItem("clientes"));
    const vendas = JSON.parse(localStorage.getItem("vendas"));
    
    vendas.forEach(item => {
        const row = document.createElement('tr'); // Cria uma nova linha de tabela
        row.id = "venda-" + item.id_nota_venda;
    
        // Cria células para cada campo do item
    
        // Código Venda (id_nota_venda)
        const cellCodigo = document.createElement('td');
        cellCodigo.textContent = item.id_nota_venda;
        row.appendChild(cellCodigo);
    
        // Nome Cliente - Aqui é necessário obter o nome do cliente de uma outra fonte, assumindo que você tem um array 'clientes'
        const cliente = clientes.find(c => c.id_cliente === item.id_cliente);
        const cellNome = document.createElement('td');
        cellNome.textContent = cliente ? cliente.nome_cliente : 'N/A';
        row.appendChild(cellNome);
    
        // Data (data_nota_venda)
        const cellData = document.createElement('td');
        cellData.textContent = item.data_nota_venda || 'N/A';
        row.appendChild(cellData);
    
        // Hora (é necessário separar a hora da data, caso exista um campo separado de hora)
        const cellHora = document.createElement('td');
        const dataHora = new Date(item.data_nota_venda); // Converte a string de data para objeto Date
        cellHora.textContent = dataHora.toLocaleTimeString() || 'N/A'; // Extrai a hora formatada
        row.appendChild(cellHora);
    
        // Descrição - (neste caso, vou usar a combinação de rua e número para fornecer uma "descrição")
        const cellDescricao = document.createElement('td');
        cellDescricao.textContent = `${item.rua_entrega}, ${item.numero_entrega}` || 'N/A';
        row.appendChild(cellDescricao);
    
        // Telefone (telefone_entrega)
        const cellTelefone = document.createElement('td');
        cellTelefone.textContent = item.telefone_entrega || 'N/A';
        row.appendChild(cellTelefone);
    
        // Valor Total (valor_total)
        const cellValorTotal = document.createElement('td');
        cellValorTotal.textContent = `R$ ${item.valor_total.toFixed(2)}` || '0.00';
        row.appendChild(cellValorTotal);
    
        // Cria a célula de ações com o ícone de detalhamento
        const cellAcoes = document.createElement('td');
        const divAcoes = document.createElement('div');
        divAcoes.className = 'icon-actions'; // Classe para estilizar a div de ações
    
        // Botão de Detalhar com ícone
        const btnDetalhar = document.createElement('a');
        btnDetalhar.className = 'table-icons waves-effect waves-light btn-small modal-trigger'; // Classes do Materialize CSS
        btnDetalhar.id = "btns-home";
        btnDetalhar.setAttribute('data-target', 'detalhar-venda'); // Define o ID do modal
        btnDetalhar.onclick = () => {
            detalharVenda(item.id_nota_venda); // Chama a função de detalhamento com o ID da venda
        };
    
        // Cria o ícone de "visibility" do Materialize para detalhar
        const iconDetalhar = document.createElement('i');
        iconDetalhar.className = 'material-icons venda-icon'; // Classe do Material Icons
        iconDetalhar.textContent = 'visibility'; // Nome do ícone
    
        // Adiciona o ícone ao link
        btnDetalhar.appendChild(iconDetalhar);
    
        // Adiciona o link ao container de ações
        divAcoes.appendChild(btnDetalhar);
    
        // Adiciona o container de ações à célula
        cellAcoes.appendChild(divAcoes);
    
        // Adiciona a célula de ações à linha da tabela
        row.appendChild(cellAcoes);
    
        // Adiciona a linha à tabela
        tabelaBalancoDiario.appendChild(row);
    });
    
}

async function balancoParcial() {
    const tabela = document.getElementById('table-balanco-parcial');
    const vendas = JSON.parse(localStorage.getItem("vendas"));
    const bairros = JSON.parse(localStorage.getItem("bairros"));
    let totalFrete = 0;
    let total = 0;
    let totalVenda = 0;

    vendas.forEach(venda => {
        // Busca o bairro correspondente à venda
        const bairro = bairros.find(b => b.id_bairro === venda.id_bairro_entrega);
        const valorFrete = bairro ? bairro.frete_bairro : 0; // Se o bairro não for encontrado, assume frete 0
        // Adiciona o valor da nota ao total
        total += venda.valor_total;
        // Adiciona o valor do frete ao frete total
        totalFrete += valorFrete;
    });

    totalVenda = total - totalFrete;

    
    const row = document.createElement('tr');

    // Cria as células para cada coluna
    const cellVendaEntregas = document.createElement('td');
    cellVendaEntregas.textContent = "R$ " + totalFrete.toFixed(2); // ID da venda

    const cellVendaLoja = document.createElement('td');
    cellVendaLoja.textContent = "R$ " + totalVenda.toFixed(2); // Valor da venda sem frete

    const cellValorParcial = document.createElement('td');
    cellValorParcial.textContent = "R$ " + total.toFixed(2); // Valor do frete

    // Adiciona as células à linha
    row.appendChild(cellVendaEntregas);
    row.appendChild(cellVendaLoja);
    row.appendChild(cellValorParcial);

    // Adiciona a linha à tabela
    tabela.appendChild(row);
    
    
}