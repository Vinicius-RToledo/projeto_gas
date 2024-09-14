
async function setLocalStorage() {
  try {
    // Dados padrão para produtos e clientes, usando await para esperar o resultado das chamadas assíncronas
    const produtos = await CRUD_API("produtos", "GET");
    const clientes = await CRUD_API("clientes", "GET");  
    const bairros = await CRUD_API("bairros", "GET");
    
    const cart = [];
    const nota_venda = [];
    const item_nota_venda = [];
    
    // Define os dados no localStorage
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('bairros', JSON.stringify(bairros));
      localStorage.setItem('nota_venda', JSON.stringify(nota_venda));
      localStorage.setItem('item_nota_venda', JSON.stringify(item_nota_venda));
      
      console.log('Dados armazenados com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao definir dados no localStorage:', error);
    }
  }
  
  // Chama a função para inicializar os dados no localStorage
  
  // Verifica se os itens necessários estão no localStorage
  function verificarLocalStorage() {
    const produtos = localStorage.getItem('produtos');
    const clientes = localStorage.getItem('clientes');
    
    if (!produtos || !clientes) {
      setLocalStorage();
    }
  }
  
  // Chama a função para verificar o localStorage
  
  verificarLocalStorage();
  
async function CRUD_API(tabela, metodo, id, dados = null) {
  // URL da API onde os dados serão enviados
  const url = `https://batistaluccas.pythonanywhere.com/API/${tabela}/${id ? `${id}/` : ''}`; // Adiciona o ID à URL se ele existir

  // Configuração da requisição
  const options = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Adiciona o corpo da requisição se for necessário
  if (dados && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
    options.body = JSON.stringify(dados); // Converte os dados para JSON
  }

  try {
    const response = await fetch(url, options); // Realiza a requisição HTTP
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    if (response.status === 204) {
      console.log('Operação bem-sucedida, nenhum conteúdo retornado.');
      return; // Não há conteúdo para retornar
    }

    const resultado = await response.json(); // Converte a resposta para JSON
    console.log(resultado); // Exibe o resultado no console
    return resultado; // Retorna o resultado
  } catch (error) {
    console.error("Erro ao consumir a API:", error); // Trata erros na requisição
  }
}
