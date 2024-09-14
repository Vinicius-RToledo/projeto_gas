function listar_produto() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    const dadosContainer = document.getElementById('dados-api');

    produtos.forEach(item => {
        const row = document.createElement('tr');
        row.id = "produto-" + item.id_produto;

        // Cria células para cada campo do item
        const cellCodigo = document.createElement('td');
        cellCodigo.textContent = item.id_produto;
        row.appendChild(cellCodigo);

        const cellNome = document.createElement('td');
        cellNome.textContent = item.nome_produto;
        row.appendChild(cellNome);
        
        const cellDescricao = document.createElement('td');
        cellDescricao.textContent = item.desc_produto || 'N/A';
        row.appendChild(cellDescricao);
        
        const cellPreco = document.createElement('td');
        cellPreco.textContent = `R$ ${item.preco_produto.toFixed(2)}`;
        row.appendChild(cellPreco);

        const cellQuantidade = document.createElement('td');
        cellQuantidade.textContent = item.quantidade_disponivel || 'N/A';
        row.appendChild(cellQuantidade);

        const cellAbastecimento = document.createElement('td');
        cellAbastecimento.textContent = item.nivel_abastecimento || 'N/A';
        row.appendChild(cellAbastecimento);

        // Cria a célula de ações com os ícones
        const cellAcoes = document.createElement('td');
        const divAcoes = document.createElement('div');
        divAcoes.className = 'icon-actions';

        // Botão de Editar com ícone
        const btnEditar = document.createElement('a');
        btnEditar.className = 'table-icons waves-effect waves-light btn-small modal-trigger';
        btnEditar.id = "btns-home";
        btnEditar.setAttribute('data-target', 'editar-produto');
        btnEditar.onclick = () => editarProduto(item.id_produto);

        // Cria o ícone de editar
        const iconEditar = document.createElement('i');
        iconEditar.className = 'material-icons client-icon';
        iconEditar.textContent = 'edit';

        btnEditar.appendChild(iconEditar);
        divAcoes.appendChild(btnEditar);

        // Botão de Excluir com ícone
        const btnRemover = document.createElement('a');
        btnRemover.id = "btns-home";
        btnRemover.className = 'table-icons waves-effect waves-light btn-small';
        btnRemover.onclick = () => deletarProduto(item.id_produto);

        // Cria o ícone de remover
        const iconRemover = document.createElement('i');
        iconRemover.className = 'material-icons client-icon';
        iconRemover.textContent = 'delete';

        btnRemover.appendChild(iconRemover);
        divAcoes.appendChild(btnRemover);

        cellAcoes.appendChild(divAcoes);
        row.appendChild(cellAcoes);

        dadosContainer.appendChild(row);
    });
}


function editarProduto(id_produto) {
    $(document).ready(function () {
        M.updateTextFields();
    });

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    const produto = produtos.find(p => p.id_produto === parseInt(id_produto));

    if (produto) {
        preencherFormulario(produto);
    } else {
        console.error('Produto não encontrado no localStorage.');
    }

    function preencherFormulario(produto) {
        const inputId = document.getElementById('id');
        const inputNome = document.getElementById('nome');
        const inputDescricao = document.getElementById('descricao');
        const inputImagem = document.getElementById('imagem');
        const inputQuantidade = document.getElementById('quantidade');
        const inputNivelAbastecimento = document.getElementById('nivel-abastecimento');
        const inputValorUnitario = document.getElementById('valor-unitario');

        if (inputId && inputNome && inputDescricao && inputImagem && inputQuantidade && inputNivelAbastecimento && inputValorUnitario) {
            inputId.value = produto.id_produto || '';
            inputNome.value = produto.nome_produto || '';
            inputDescricao.value = produto.desc_produto || '';
            inputImagem.value = produto.imagem_produto || '';
            inputQuantidade.value = produto.quantidade_disponivel || '';
            inputNivelAbastecimento.value = produto.nivel_abastecimento || '';
            inputValorUnitario.value = produto.preco_produto !== undefined && produto.preco_produto !== null ? produto.preco_produto.toFixed(2) : '';
        } else {
            console.error("Um ou mais elementos do formulário não foram encontrados no DOM.");
        }
    }

    document.getElementById('produto-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const id_produto = parseInt(document.getElementById('id').value);
        const nome_produto = document.getElementById('nome').value;
        const desc_produto = document.getElementById('descricao').value;
        const preco_produto = parseFloat(document.getElementById('valor-unitario').value);
        const imagem_produto = document.getElementById('imagem').value;
        const quantidade_disponivel = parseInt(document.getElementById('quantidade').value);
        const nivel_abastecimento = parseInt(document.getElementById('nivel-abastecimento').value);

        const produtoAtualizado = {
            id_produto,
            nome_produto,
            desc_produto,
            preco_produto,
            imagem_produto,
            quantidade_disponivel,
            nivel_abastecimento,
        };

        // Atualiza o localStorage diretamente
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const index = produtos.findIndex(p => p.id_produto === parseInt(produtoAtualizado.id_produto));

        if (index !== -1) {
            produtos[index] = produtoAtualizado;
            localStorage.setItem('produtos', JSON.stringify(produtos));
            alert("Editado com sucesso!");
            window.location.reload();
        } else {
            console.error('Produto não encontrado no localStorage.');
        }
    });
}


async function deletarProduto(idProduto) {
    try {
        // Chama a API para deletar o produto
        await CRUD_API("produtos", "DELETE", idProduto);

        // Obter a lista de produtos do localStorage
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

        // Filtrar a lista de produtos para remover o produto específico
        produtos = produtos.filter(produto => produto.id_produto !== idProduto);

        // Atualizar o localStorage com a nova lista de produtos
        localStorage.setItem('produtos', JSON.stringify(produtos));

        // Remover o elemento da tabela na interface
        const row = document.getElementById(`produto-${idProduto}`);
        if (row) {
            row.remove();
        }

        // Exibir mensagem de sucesso
        M.toast({html: `Produto com ID ${idProduto} deletado com sucesso!`, classes: 'green'});
    } catch (error) {
        // Exibir mensagem de erro
        M.toast({html: `Erro ao deletar o produto: ${error.message}`, classes: 'red'});
    }
}


function cadastrarProduto() {
    const id_produto = parseInt(document.getElementById('id_produto').value) || Date.now(); 
    const nome_produto = document.getElementById('nome_produto').value;
    const desc_produto = document.getElementById('descricao_produto').value;
    const preco_produto = parseFloat(document.getElementById('valor-unitario_produto').value);
    const imagem_produto = document.getElementById('imagem_produto').value;
    const quantidade_disponivel = parseInt(document.getElementById('quantidade_produto').value);
    const nivel_abastecimento = parseInt(document.getElementById('nivel-abastecimento_produto').value);

    const produto = {
        id_produto,
        nome_produto,
        desc_produto,
        preco_produto,
        imagem_produto,
        quantidade_disponivel,
        nivel_abastecimento
    };

    // Adicionar o novo produto
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));

    M.toast({html: `Produto cadastrado com sucesso!`, classes: 'green'});
    
    M.updateTextFields();
    document.getElementById('cadastrar-produto-form').reset();
}
