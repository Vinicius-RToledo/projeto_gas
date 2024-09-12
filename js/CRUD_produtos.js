function listar_produto(){  



    const produtos = JSON.parse(localStorage.getItem('produtos'));

    const dadosContainer = document.getElementById('dados-api'); // Seleciona o corpo da tabela

    // Itera sobre os dados recebidos e cria linhas de tabela
    produtos.forEach(item => {
        const row = document.createElement('tr'); // Cria uma nova linha de tabela

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
        btnEditar.className = '  table-icons waves-effect waves-light btn-small modal-trigger'; // Classes do Materialize CSS
        btnEditar.id = "btns-home";
        btnEditar.setAttribute('data-target', 'editar-produto'); // Define o ID do modal
        btnEditar.onclick = () => {
            editarProduto(item.id_produto); // Chama a função de edição com o ID do cliente
        };        

        // Cria o ícone de editar do Materialize
        const iconEditar = document.createElement('i');
        iconEditar.className = 'material-icons client-icon'; // Classe do Material Icons
        iconEditar.textContent = 'edit'; // Nome do ícone

        // Adiciona o ícone ao link
        btnEditar.appendChild(iconEditar);

        // Adiciona o link ao container de ações
        divAcoes.appendChild(btnEditar);

        // Botão de Excluir com ícone
        const btnRemover = document.createElement('a');
        btnRemover.id = "btns-home";
        btnRemover.className = ' table-icons waves-effect waves-light btn-small'; // Classes do Materialize CSS
        btnRemover.onclick = () => deletarProduto(item.id_produto); // Define o evento onclick

        // Cria o ícone de remover do Materialize
        const iconRemover = document.createElement('i');
        iconRemover.className = 'material-icons client-icon'; // Classe do Material Icons
        iconRemover.textContent = 'delete'; // Nome do ícone

        // Adiciona o ícone ao link
        btnRemover.appendChild(iconRemover);

        // Adiciona o link ao container de ações
        divAcoes.appendChild(btnRemover);

        // Adiciona o container de ações à célula
        cellAcoes.appendChild(divAcoes);

        // Adiciona a célula de ações à linha da tabela
        row.appendChild(cellAcoes);

        // Adiciona a linha criada ao corpo da tabela
        dadosContainer.appendChild(row);            
})
}

function editarProduto(id_produto){

    // atualiza a modal do html para preencher corretamente 
    $(document).ready(function () {
        M.updateTextFields();
    });

    

    let produtos = [];
    
    async function carregarDados() {
        produtos = await getLocalStorage('produtos'); // Chama a função e espera sua resolução
        console.log('teste ok', produtos); // Exibe os produtos recuperados
        if (!Array.isArray(produtos)) {
            console.error('O retorno de getLocalStorage não é um array.', produtos);
            return;
        }
        const produto = produtos.find(p => p.id_produto === parseInt(id_produto));

        if (produto) {
            console.log('Produto encontrado:', produto);

            // Preenche os campos do formulário com os dados do produto
           preencherFormulario(produto);

        } else {
            console.error('Produto não encontrado no localStorage.');
        }
    }
    
    function preencherFormulario(produto) {
        // Verifique se todos os elementos existem antes de acessar suas propriedades
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

    // Chama a função
    carregarDados();


    //SEPARAR OS SCRIPTS

    // Obtém o formulário e adiciona um ouvinte de evento para o envio
    document.getElementById('produto-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os dados do formulário
    const id_produto = parseInt(document.getElementById('id').value);
    const nome_produto = document.getElementById('nome').value;
    const desc_produto = document.getElementById('descricao').value;
    const preco_produto = parseFloat(document.getElementById('valor-unitario').value);
    const imagem_produto = document.getElementById('imagem').value;
    const quantidade_disponivel = parseInt(document.getElementById('quantidade').value);
    const nivel_abastecimento = parseInt(document.getElementById('nivel-abastecimento').value);

    // Dados a serem enviados
    const produtoAtualizado = {
        id_produto: id_produto,
        nome_produto: nome_produto,
        desc_produto: desc_produto,
        preco_produto: preco_produto,
        imagem_produto: imagem_produto,
        quantidade_disponivel: quantidade_disponivel,
        nivel_abastecimento: nivel_abastecimento,
    };

    //o proximo codigo deve ser removido e o codigo comentado deve voltar quando for conectar com a API

    function atualizarLocalStorage() {
        let produtos = JSON.parse(localStorage.getItem("produtos")) || []; // Obtém produtos ou inicializa como array vazio

        // Encontra o índice do produto a ser atualizado
        const index = produtos.findIndex(p => p.id_produto === parseInt(produtoAtualizado.id_produto));

        if (index !== -1) {
            // Atualiza o produto no array
            produtos[index] = produtoAtualizado;
            // Salva o array atualizado no localStorage
            localStorage.setItem('produtos', JSON.stringify(produtos));
            alert("Editado com sucesso!");
            window.location.reload(); // Recarrega a página para refletir as alterações
        } else {
            console.error('Produto não encontrado no localStorage.');
        }
    }

    // Chama a função para atualizar o localStorage
    atualizarLocalStorage();

/* 
    // URL da API onde os produtoAtualizado serão enviados
    const url = `http://127.0.0.1:8000/API/produtos/${id_produto}/`; // Substitua pela URL da sua API

    // Envia os produtoAtualizado para a API usando fetch
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoAtualizado) // Converte os produtoAtualizado para JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then( */
            
            /* produtoAtualizado => {
            produtos = JSON.parse(localStorage.getItem("produtos"));
            const index = produtos.findIndex(p => p.id_produto === produtoAtualizado.id_produto);
            produtos[index] = produtoAtualizado;
            localStorage.setItem('produtos', JSON.stringify(produtos));
            
            alert("Editado com sucesso!");
            window.location.reload();// Aqui você pode adicionar lógica para lidar com a resposta, por exemplo, redirecionar ou mostrar uma mensagem de sucesso
        } *//* )
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            // Aqui você pode adicionar lógica para lidar com erros
        }); */
});
        
}

function deletarProduto(idProduto) {
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

    // Exibir mensagem de confirmação
    console.log(`Produto com ID ${idProduto} deletado.`);

    location.reload();
}

function cadastrarProduto() {
        // Obtendo os valores dos campos
        const id_produto = parseInt(document.getElementById('id_produto').value) || Date.now(); // Gera um ID único se não estiver definido
        const nome_produto = document.getElementById('nome_produto').value;
        const desc_produto = document.getElementById('descricao_produto').value;
        const preco_produto = parseFloat(document.getElementById('valor-unitario_produto').value);
        const imagem_produto = document.getElementById('imagem_produto').value;
        const quantidade_disponivel = parseInt(document.getElementById('quantidade_produto').value);
        const nivel_abastecimento = parseInt(document.getElementById('nivel-abastecimento_produto').value);

        // Criar um objeto de produto
        const produto = {
            id_produto,
            nome_produto,
            desc_produto,
            preco_produto,
            imagem_produto,
            quantidade_disponivel,
            nivel_abastecimento
        };

        // Recuperar produtos existentes do localStorage
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

        // Adicionar o novo produto
        produtos.push(produto);

        // Atualizar o localStorage
        localStorage.setItem('produtos', JSON.stringify(produtos));

        // Limpar o formulário após o cadastro
        location.reload();
}



