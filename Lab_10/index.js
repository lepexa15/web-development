let apiUrl = "https://dummyjson.com/products";
let categoriesData = [];
async function fetchProducts() {
    let grid = document.getElementById("productsGrid");
    let title = document.getElementById("catalogTitle");
    title.textContent = "Усі товари";
    grid.className = "products-grid";
    grid.innerHTML = "<p>Завантаження товарів...</p>";
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        renderProducts(data.products);
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="error-msg">Помилка завантаження товарів.</p>';
    }
}
async function fetchProductsByCategory(slug, name) {
    let grid = document.getElementById("productsGrid");
    let title = document.getElementById("catalogTitle");
    title.textContent = "Категорія: " + name;
    grid.className = "products-grid";
    grid.innerHTML = "<p>Завантаження товарів...</p>";
    try {
        const res = await fetch(apiUrl + "/category/" + slug);
        const data = await res.json();
        renderProducts(data.products);
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="error-msg">Помилка завантаження категорії.</p>';
    }
}
async function fetchProductById(id) {
    let grid = document.getElementById("productsGrid");
    let title = document.getElementById("catalogTitle");
    grid.className = "";
    grid.innerHTML = "<p>Завантаження товару...</p>";
    try {
        const res = await fetch(apiUrl + "/" + id);
        const item = await res.json();
        let brand = "Не вказано";
        if (item.brand) {
            brand = item.brand;
        }
        title.textContent = item.title;
        let html = '<div class="box">';
        html += '<p style="margin-bottom: 12px;"><button type="button" class="btn btn-small" onclick="showAllProducts()">← Назад до каталогу</button></p>';
        html += '<img src="' + item.thumbnail + '" alt="' + item.title + '" class="product-img-large">';
        html += '<div class="product-meta">Категорія: ' + item.category + '</div>';
        html += '<h2>' + item.title + '</h2>';
        html += '<div class="product-price">Ціна: $' + item.price + '</div>';
        html += '<p>' + item.description + '</p>';
        html += '<table class="details-table">';
        html += '<tr><td>Виробник</td><td>' + brand + '</td></tr>';
        html += '<tr><td>Рейтинг</td><td>' + item.rating + ' / 5</td></tr>';
        html += '<tr><td>У наявності</td><td>' + item.stock + ' шт.</td></tr>';
        html += '<tr><td>Код товару</td><td>#' + item.id + '</td></tr>';
        html += '</table>';
        html += '</div>';
        grid.innerHTML = html;
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="error-msg">Помилка завантаження товару.</p>';
    }
}
async function fetchCategories() {
    let list = document.getElementById("categoriesList");
    try {
        const res = await fetch(apiUrl + "/categories");
        const categories = await res.json();
        categoriesData = categories;
        let html = "";
        for (let i = 0; i < categories.length; i++) {
            html += '<li class="category-item" onclick="selectCategory(this, ' + i + ')">';
            html += categories[i].name;
            html += '</li>';
        }
        list.innerHTML = html;
    } catch (error) {
        console.error(error);
        list.innerHTML = '<li class="error-msg">Не вдалося завантажити категорії.</li>';
    }
}
function renderProducts(products) {
    let grid = document.getElementById("productsGrid");
    grid.className = "products-grid";
    if (!products || products.length === 0) {
        grid.innerHTML = "<p>Товарів не знайдено.</p>";
        return;
    }
    let html = "";
    for (let i = 0; i < products.length; i++) {
        let item = products[i];
        let brand = "—";
        if (item.brand) {
            brand = item.brand;
        }
        html += '<div class="product-card">';
        html += '<div>';
        html += '<img src="' + item.thumbnail + '" alt="' + item.title + '" class="product-img">';
        html += '<div class="product-meta">Категорія: ' + item.category + '</div>';
        html += '<h3>' + item.title + '</h3>';
        html += '<div class="product-meta">Виробник: <strong>' + brand + '</strong></div>';
        html += '</div>';
        html += '<div>';
        html += '<div class="product-price">$' + item.price + '</div>';
        html += '<button type="button" class="btn btn-small" onclick="fetchProductById(' + item.id + ')">Детальніше</button>';
        html += '</div>';
        html += '</div>';
    }
    grid.innerHTML = html;
}
function selectCategory(element, index) {
    let items = document.querySelectorAll(".category-item");
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
    }
    element.classList.add("active");
    let selected = categoriesData[index];
    fetchProductsByCategory(selected.slug, selected.name);
}
function showAllProducts() {
    let items = document.querySelectorAll(".category-item");
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
    }
    fetchProducts();
}
window.onload = function() {
    let seeAllBtn = document.getElementById("seeAllBtn");
    seeAllBtn.onclick = showAllProducts;
    fetchCategories();
    fetchProducts();
};