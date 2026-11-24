class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }
    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}
class SoftFurniture extends Product {
    constructor(name, amount, image) {
        super(name, "М'які меблі", amount, image);
    }
}
class CabinetFurniture extends Product {
    constructor(name, amount, image) {
        super(name, "Корпусні меблі", amount, image);
    }
}
class KitchenFurniture extends Product {
    constructor(name, amount, image) {
        super(name, "Для кухні", amount, image);
    }
}
function productFactory(item) {
    if (item.category === "М'які меблі") {
        return new SoftFurniture(item.name, item.amount, item.image);
    } else if (item.category === "Корпусні меблі") {
        return new CabinetFurniture(item.name, item.amount, item.image);
    } else if (item.category === "Для кухні") {
        return new KitchenFurniture(item.name, item.amount, item.image);
    }
    return new Product(item.name, item.category, item.amount, item.image);
}
class Basket {
    constructor() {
        this.products = [];
    }
    add(product) {
        let now = new Date();
        let addedTime = now.toLocaleTimeString("uk-UA");
        let basketEntry = {
            name: product.name,
            category: product.category,
            time: addedTime
        };
        this.products.push(basketEntry);
        product.addToBasket();
        this.renderBasket();
    }
    renderBasket() {
        let basketList = document.getElementById("basketList");
        let basketCount = document.getElementById("basketCount");
        basketCount.textContent = this.products.length;
        let html = "";
        for (let i = 0; i < this.products.length; i++) {
            let item = this.products[i];
            html += '<div class="basket-item">';
            html += '<div class="basket-item-title">' + (i + 1) + '. ' + item.name + '</div>';
            html += '<div class="basket-item-meta">Категорія: ' + item.category + '</div>';
            html += '<div class="basket-item-meta">Час додавання: <strong>' + item.time + '</strong></div>';
            html += '</div>';
        }
        basketList.innerHTML = html;
    }
}
class Store {
    constructor() {
        this.products = [];
        this.basket = new Basket();
    }
    fillStoreWithProducts(jsonData) {
        this.products = [];
        for (let i = 0; i < jsonData.length; i++) {
            let obj = productFactory(jsonData[i]);
            this.products.push(obj);
        }
        this.renderStore();
    }
    addProductToBasket(index) {
        let product = this.products[index];
        product.amount -= 1;
        this.basket.add(product);
        this.renderStore();
    }
    renderStore() {
        let productsList = document.getElementById("productsList");
        if (!productsList) return;
        let html = "";
        for (let i = 0; i < this.products.length; i++) {
            let product = this.products[i];
            let amountClass = product.amount === 0 ? "product-amount out" : "product-amount";
            let amountText = product.amount > 0 ? "У наявності: " + product.amount + " шт." : "Немає в наявності";
            let btnDisabled = product.amount === 0 ? "disabled" : "";
            let btnText = product.amount > 0 ? "Додати в кошик" : "Товар закінчився";
            html += '<div class="product-card">';
            html += '<div>';
            html += '<img src="' + product.image + '" alt="' + product.name + '" class="product-img">';
            html += '<div class="product-category">' + product.category + '</div>';
            html += '<h3>' + product.name + '</h3>';
            html += '</div>';
            html += '<div>';
            html += '<div class="' + amountClass + '">' + amountText + '</div>';
            html += '<button type="button" class="btn" ' + btnDisabled + ' onclick="store.addProductToBasket(' + i + ')">' + btnText + '</button>';
            html += '</div>';
            html += '</div>';
        }
        productsList.innerHTML = html;
    }
}
let fallbackProducts = [
    { name: "Диван розкладний «Марсель»", category: "М'які меблі", amount: 3, image: "images/divan.jpg" },
    { name: "Крісло м’яке «Берген»", category: "М'які меблі", amount: 4, image: "images/krislo.jpg" },
    { name: "Двоспальне ліжко «Верона»", category: "М'які меблі", amount: 2, image: "images/divan2.jpg" },
    { name: "Шафа-купе «Лофт-2»", category: "Корпусні меблі", amount: 2, image: "images/shafa.jpg" },
    { name: "Стіл комп’ютерний «СК-14»", category: "Корпусні меблі", amount: 5, image: "images/stil.jpg" },
    { name: "Полиця настінна «ПН-3»", category: "Корпусні меблі", amount: 3, image: "images/polytsya.jpg" },
    { name: "Кухонний комплект «Олівія»", category: "Для кухні", amount: 2, image: "images/kuhnya.jpg" },
    { name: "Стіл обідній «Дуб»", category: "Для кухні", amount: 3, image: "images/stil2.jpg" },
    { name: "Комплект стільців «Модерн»", category: "Для кухні", amount: 4, image: "images/krislo2.jpg" }
];
let store = new Store();
window.onload = function() {
    fetch("products.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            store.fillStoreWithProducts(data);
        })
        .catch(function() {
            store.fillStoreWithProducts(fallbackProducts);
        });
};