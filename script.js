const stock = [];

// Adiciona evento ao formulário para adicionar produtos
document.getElementById("add-product-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const productName = document.getElementById("product-name").value;
    const productQuantity = parseInt(document.getElementById("product-quantity").value);
    
    if (productName && productQuantity >= 0) {
        addProductToStock(productName, productQuantity);
        document.getElementById("add-product-form").reset(); // Limpa o formulário após adicionar o produto
    }
});

// Função para adicionar ou atualizar o produto no estoque com limite de 100 unidades
function addProductToStock(name, quantity) {
    const existingProduct = stock.find(product => product.name.toLowerCase() === name.toLowerCase());

    if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        if (newQuantity <= 100) {
            existingProduct.quantity = newQuantity; // Atualiza a quantidade
        } else {
            alert(`Quantidade excede o limite de 100 unidades para o produto "${name}".`);
            return;
        }
    } else {
        if (quantity <= 100) {
            const product = { name, quantity };
            stock.push(product); // Adiciona novo produto
        } else {
            alert(`Você não pode adicionar mais de 100 unidades de "${name}".`);
            return;
        }
    }

    // Alerta de pouco estoque
    if (existingProduct && existingProduct.quantity < 3) {
        alert(`Alerta: Estoque baixo do produto "${existingProduct.name}". Restam apenas ${existingProduct.quantity} unidades!`);
    }

    updateStockTable();
}

// Atualiza todas as tabelas (estoque e produtos sem estoque)
function updateStockTable() {
    const stockBody = document.getElementById("stock-body");
    const outOfStockBody = document.getElementById("out-of-stock-body");

    stockBody.innerHTML = ""; // Limpa a tabela de estoque
    outOfStockBody.innerHTML = ""; // Limpa a tabela de produtos sem estoque

    stock.forEach((product, index) => {
        // Se a quantidade for maior que 0, adiciona à tabela de estoque
        if (product.quantity > 0) {
            const stockRow = `<tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td class="actions">
                    <button onclick="removeProduct(${index})">Remover uma unidade</button>
                </td>
            </tr>`;
            stockBody.innerHTML += stockRow;
        } else {
            // Se a quantidade for 0, adiciona à tabela de produtos sem estoque
            const outOfStockRow = `<tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td class="actions">Sem estoque</td>
            </tr>`;
            outOfStockBody.innerHTML += outOfStockRow;
        }
    });
}

// Remove uma unidade do produto
function removeProduct(index) {
    if (stock[index].quantity > 0) {
        stock[index].quantity -= 1; // Reduz a quantidade em 1
    }

    // Alerta de pouco estoque
    if (stock[index].quantity < 3 && stock[index].quantity >= 0) {
        alert(`Alerta: Estoque baixo do produto "${stock[index].name}". Restam apenas ${stock[index].quantity} unidades!`);
    }

    updateStockTable();
}

// Pesquisa de produtos
function searchProduct() {
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const stockBody = document.getElementById("stock-body");
    stockBody.innerHTML = ""; // Limpa a tabela antes da pesquisa

    const filteredStock = stock.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );

    filteredStock.forEach((product, index) => {
        if (product.quantity > 0) {
            const row = `<tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td class="actions">
                    <button onclick="removeProduct(${index})">Remover uma unidade</button>
                </td>
            </tr>`;
            stockBody.innerHTML += row;
        }
    });
}
