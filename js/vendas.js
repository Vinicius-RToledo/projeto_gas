function gerarHTMLProdutos() {
    const produtos = JSON.parse(localStorage.getItem("produtos")); // Obtém os produtos do localStorage usando sua função
    const container = document.getElementById('produtos-container'); // Contêiner onde os produtos serão inseridos

    // Limpa o contêiner antes de adicionar novos elementos
    container.innerHTML = '';

    let row; // Variável para a linha atual

    produtos.forEach((produto, index) => {
        // Criação de uma nova row a cada 3 produtos
        if (index % 3 === 0) {
            // Adiciona uma coluna vazia no início da nova linha

            row = document.createElement('div'); // Cria uma nova linha
            row.className = 'row center-align'; // Adiciona a classe de linha
            container.appendChild(row); // Adiciona a nova linha ao contêiner

            const emptyCol = document.createElement('div');
            emptyCol.className = 'col s.5'; // Coluna vazia para espaçamento
            row.appendChild(emptyCol);

        }

        // Adiciona uma coluna vazia antes de cada card, exceto o primeiro card da linha
        if (index % 3 !== 0) {
            const emptyCol = document.createElement('div');
            emptyCol.className = 'col s1'; // Coluna vazia para espaçamento
            row.appendChild(emptyCol);
        }

        // Criação do card do produto
        const productCard = document.createElement('div'); // Elemento pai para o card do produto
        productCard.className = 'card col s3'; // Adiciona a classe de card e a largura de coluna

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content center'; // Adiciona a classe de conteúdo do card

        const productImage = document.createElement('img');
        productImage.src = produto.imagem_produto; // Adiciona a URL da imagem
        productImage.alt = produto.desc_produto; // Texto alternativo para a imagem
        productImage.className = 'responsive-img'; // Classe para tornar a imagem responsiva

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = produto.desc_produto;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = produto.preco_produto;

        // Montagem do conteúdo do card
        cardContent.appendChild(productImage);
        cardContent.appendChild(description);
        cardContent.appendChild(price);

        // Criação da seção de ações do card
        const cardAction = document.createElement('div');
        cardAction.className = 'card-action center';

        const actionRow = document.createElement('div');
        actionRow.className = 'row';

        // Botão de remover
        const colRemove = document.createElement('div');
        colRemove.className = 'col s4';
        const btnRemove = document.createElement('a');
        btnRemove.className = 'btn-floating btn-medium';
        btnRemove.addEventListener('click', function() {
            removerCart(produto.id_produto); // Adiciona o evento de clique
        });
        const iconRemove = document.createElement('i');
        iconRemove.className = 'material-icons btn-action-card';
        iconRemove.textContent = 'remove';
        btnRemove.appendChild(iconRemove);
        colRemove.appendChild(btnRemove);

        // Quantidade
        const colQuantity = document.createElement('div');
        colQuantity.className = 'col s4';
        const quantity = document.createElement('span');
        quantity.id = `quantity-${produto.id_produto}`; // Adiciona um ID único para cada quantidade
        quantity.style.fontSize = '1.5rem';
        colQuantity.appendChild(quantity);

        // Botão de adicionar
        const colAdd = document.createElement('div');
        colAdd.className = 'col s4';
        const btnAdd = document.createElement('a');
        btnAdd.className = 'btn-floating btn-medium';
        btnAdd.addEventListener('click', function() {
            adicionarCart(produto.id_produto); // Adiciona o evento de clique
        });
        const iconAdd = document.createElement('i');
        iconAdd.className = 'material-icons btn-action-card';
        iconAdd.textContent = 'add';
        btnAdd.appendChild(iconAdd);
        colAdd.appendChild(btnAdd);

        // Montagem da row de ações
        actionRow.appendChild(colRemove);
        actionRow.appendChild(colQuantity);
        actionRow.appendChild(colAdd);
        cardAction.appendChild(actionRow);

        // Montagem do card
        productCard.appendChild(cardContent);
        productCard.appendChild(cardAction);

        // Adiciona o card à row atual
        row.appendChild(productCard);
        atualizarQuantidadeNoHTML(produto.id_produto);

        // Adiciona uma coluna vazia após o último card da linha
        if ((index + 1) % 3 === 0) {
            const emptyColEnd = document.createElement('div');
            emptyColEnd.className = 'col s.5'; // Coluna vazia para espaçamento
            row.appendChild(emptyColEnd);
        }
    });

    // Adiciona uma coluna vazia no final da última linha se o número total de produtos não for múltiplo de 3
    const lastRow = container.querySelector('.row:last-of-type');
    if (lastRow && produtos.length % 3 !== 0) {
        const emptyColEnd = document.createElement('div');
        emptyColEnd.className = 'col s1'; // Coluna vazia para espaçamento
        lastRow.appendChild(emptyColEnd);
    }

}

// Função para adicionar um item ao carrinho no localStorage
function adicionarCart(id_produto) {
    // Recupera o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Verifica se o item já está no carrinho
    const produto = produtos.find(item => item.id_produto === id_produto);

    console.log(produto);
    
    const itemIndex = cart.findIndex(item => item["produto"].id_produto === id_produto);
    if (itemIndex === -1) {
        // Se o item não estiver no carrinho, adiciona-o
        cart.push({produto, quantidade_cart: 1 });
    } else {
        // Se o item já estiver no carrinho, aumenta a quantidade
        cart[itemIndex].quantidade_cart += 1;
    }

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    atualizarQuantidadeNoHTML(id_produto);
    
    // Atualiza a interface do usuário (se necessário)
    console.log(`Produto com ID ${id_produto} adicionado ao carrinho.`);
}

// Função para remover um item do carrinho no localStorage
function removerCart(id_produto) {
    // Recupera o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encontra o índice do item no carrinho
    const itemIndex = cart.findIndex(item => item.produto.id_produto === id_produto);

    if (itemIndex !== -1) {
        // Se o item for encontrado
        if (cart[itemIndex].quantidade_cart > 1) {
            // Se a quantidade for maior que 1, decrementa a quantidade
            cart[itemIndex].quantidade_cart -= 1;
        } else {
            // Se a quantidade for 1, remove o item do carrinho
            cart.splice(itemIndex, 1);
        }

        // Salva o carrinho atualizado no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        atualizarQuantidadeNoHTML(id_produto);

        // Atualiza a interface do usuário (se necessário)
        console.log(`Produto com ID ${id_produto} atualizado no carrinho.`);
    } else {
        console.log(`Produto com ID ${id_produto} não encontrado no carrinho.`);
    }
}


// Função para atualizar a quantidade de um item no carrinho
function atualizarQuantidadeNoHTML(id_produto) {
    // Recupera o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Encontra o item no carrinho
    const item = cart.find(item => item.produto.id_produto === id_produto);
    console.log(item);

    // Encontra o elemento da quantidade no HTML usando o ID único
    const quantityElement = document.getElementById(`quantity-${id_produto}`);

    if (quantityElement) {
        // Define a quantidade como 0 se o item não estiver no carrinho, caso contrário usa a quantidade do item
        const quantidade = item ? item.quantidade_cart : 0;
        quantityElement.textContent = quantidade;
    }
}




// Chama a função para gerar o HTML assim que a página carregar
