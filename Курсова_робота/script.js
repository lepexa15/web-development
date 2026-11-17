const initialFurniture = [
    {
        id: 1,
        name: "Диван розкладний «Марсель»",
        category: "М'які меблі",
        manufacturer: "Blest",
        dimensions: "230×105×88 см",
        material: "Каркас дерево, оббивка рогожка",
        price: 16800,
        image: "images/divan.jpg",
        description: "Зручний диван із механізмом трансформації та нішею для білизни."
    },
    {
        id: 2,
        name: "Шафа-купе «Лофт-2»",
        category: "Корпусні меблі",
        manufacturer: "GERBOR",
        dimensions: "180×60×220 см",
        material: "Ламінована ДСП 16 мм",
        price: 11400,
        image: "images/shafa.jpg",
        description: "Містка дводверна шафа-купе зі штангою для одягу та відділенням із полицями."
    },
    {
        id: 3,
        name: "Кухонний комплект «Олівія»",
        category: "Для кухні",
        manufacturer: "BRW Україна",
        dimensions: "200×60×210 см",
        material: "Корпус ДСП, фасади МДФ",
        price: 14200,
        image: "images/kuhnya.jpg",
        description: "Набір кухонних шаф із вологостійкою стільницею."
    },
    {
        id: 4,
        name: "Стіл комп’ютерний «СК-14»",
        category: "Офісні меблі",
        manufacturer: "AMF",
        dimensions: "120×60×75 см",
        material: "ЛДСП, металеві опори",
        price: 4300,
        image: "images/stil.jpg",
        description: "Робочий стіл із трьома висувними шухлядами для дому або офісу."
    },
    {
        id: 5,
        name: "Крісло м’яке «Берген»",
        category: "М'які меблі",
        manufacturer: "Blest",
        dimensions: "82×85×92 см",
        material: "Велюр, букові ніжки",
        price: 7900,
        image: "images/krislo.jpg",
        description: "Комфортне крісло для відпочинку з високою спинкою."
    },
    {
        id: 6,
        name: "Полиця настінна «ПН-3»",
        category: "Декор та аксесуари",
        manufacturer: "Viorina-Deko",
        dimensions: "90×22×45 см",
        material: "ЛДСП Дуб Сонома",
        price: 1150,
        image: "images/polytsya.jpg",
        description: "Декоративна навісна полиця для книг та елементів інтер'єру."
    }
];
function loadProducts() {
    const data = localStorage.getItem("furniture_catalog_v2");
    if (!data) {
        localStorage.setItem("furniture_catalog_v2", JSON.stringify(initialFurniture));
        return [...initialFurniture];
    }
    return JSON.parse(data);
}
function saveProducts(list) {
    localStorage.setItem("furniture_catalog_v2", JSON.stringify(list));
}
// Слайдер на головній сторінці
function initSlider() {
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    const counter = document.getElementById("slideCounter");
    if (!slides.length) return;
    let current = 0;
    function updateSlider(index) {
        if (index < 0) current = slides.length - 1;
        else if (index >= slides.length) current = 0;
        else current = index;
        slides.forEach(slide => slide.classList.remove("active"));
        slides[current].classList.add("active");
        counter.textContent = "Слайд " + (current + 1) + " з " + slides.length;
    }
    prevBtn.addEventListener("click", () => updateSlider(current - 1));
    nextBtn.addEventListener("click", () => updateSlider(current + 1));
}
// Авторизація та реєстрація
function initAuth() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const tabButtons = document.querySelectorAll("[data-tab]");
    if (!loginForm || !registerForm) return;
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const formId = btn.dataset.tab;
            loginForm.style.display = formId === "loginForm" ? "block" : "none";
            registerForm.style.display = formId === "registerForm" ? "block" : "none";
        });
    });
    function checkField(input, condition) {
        const row = input.closest(".form-row");
        if (condition) row.classList.remove("has-error");
        else row.classList.add("has-error");
        return condition;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+380\d{9}$/;
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail");
        const pass = document.getElementById("loginPassword");
        const role = document.getElementById("loginRole").value;
        const okEmail = checkField(email, emailPattern.test(email.value.trim()));
        const okPass = checkField(pass, pass.value.length >= 6);
        if (okEmail && okPass) {
            window.location.href = role === "admin" ? "admin.html" : "catalog.html";
        }
    });
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName");
        const email = document.getElementById("regEmail");
        const phone = document.getElementById("regPhone");
        const pass = document.getElementById("regPassword");
        const confirm = document.getElementById("regConfirm");
        const v1 = checkField(name, name.value.trim().length >= 3);
        const v2 = checkField(email, emailPattern.test(email.value.trim()));
        const v3 = checkField(phone, phonePattern.test(phone.value.trim()));
        const v4 = checkField(pass, pass.value.length >= 6);
        const v5 = checkField(confirm, confirm.value === pass.value && confirm.value.length >= 6);
        if (v1 && v2 && v3 && v4 && v5) {
            alert("Реєстрація успішна. Виконано вхід у каталог");
            window.location.href = "catalog.html";
        }
    });
}
// Каталог товарів
function initCatalog() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    const tabs = document.querySelectorAll("#categoryTabs .tab-btn");
    const searchInput = document.getElementById("searchInput");
    const manufacturerSelect = document.getElementById("manufacturerFilter");
    const resetBtn = document.getElementById("resetBtn");
    let activeCategory = "all";
    function render() {
        const products = loadProducts();
        const query = searchInput.value.trim().toLowerCase();
        const manufacturer = manufacturerSelect.value;
        const filtered = products.filter(item => {
            const matchCategory = activeCategory === "all" || item.category === activeCategory;
            const matchName = !query || item.name.toLowerCase().includes(query);
            const matchManufacturer = manufacturer === "all" || item.manufacturer === manufacturer;
            return matchCategory && matchName && matchManufacturer;
        });
        if (!filtered.length) {
            grid.innerHTML = "<p>Товарів не знайдено.</p>";
            return;
        }
        grid.innerHTML = filtered.map(item => `
            <div class="product-card">
                <div>
                    <img src="${item.image}" alt="${item.name}" class="product-img">
                    <div class="product-meta">Категорія: ${item.category}</div>
                    <h3>${item.name}</h3>
                    <div class="product-meta">Виробник: <strong>${item.manufacturer}</strong></div>
                    <div class="product-meta">Габарити: ${item.dimensions}</div>
                </div>
                <div>
                    <div class="product-price">${item.price} грн</div>
                    <a href="product.html?id=${item.id}" class="btn btn-small">Детальніше</a>
                </div>
            </div>
        `).join("");
    }
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeCategory = tab.dataset.category;
            render();
        });
    });
    searchInput.addEventListener("input", render);
    manufacturerSelect.addEventListener("change", render);
    resetBtn.addEventListener("click", () => {
        searchInput.value = "";
        manufacturerSelect.value = "all";
        activeCategory = "all";
        tabs.forEach(t => t.classList.remove("active"));
        tabs[0].classList.add("active");
        render();
    });
    render();
}
// Інформація про товар
function initProductDetails() {
    const container = document.getElementById("productDetails");
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id")) || 1;
    const products = loadProducts();
    const item = products.find(p => p.id === id) || products[0];
    container.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="product-img-large">
        <div>
            <div class="product-meta">Категорія: ${item.category}</div>
            <h1>${item.name}</h1>
            <div class="product-price" style="font-size: 20px;">Ціна: ${item.price} грн</div>
            <p>${item.description}</p>
            <table class="details-table">
                <tr><td>Виробник</td><td>${item.manufacturer}</td></tr>
                <tr><td>Габарити (Ш×Г×В)</td><td>${item.dimensions}</td></tr>
                <tr><td>Матеріал</td><td>${item.material}</td></tr>
                <tr><td>Код товару</td><td>#${item.id}</td></tr>
            </table>
        </div>
    `;
}
// Модуль адміна
function initAdmin() {
    const form = document.getElementById("adminForm");
    const tbody = document.getElementById("adminTableBody");
    if (!form || !tbody) return;
    const heading = document.getElementById("formHeading");
    const idInput = document.getElementById("itemId");
    const cancelBtn = document.getElementById("cancelEdit");
    function renderTable() {
        const products = loadProducts();
        tbody.innerHTML = products.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.manufacturer}</td>
                <td>${item.price} грн</td>
                <td>
                    <button type="button" class="btn btn-small" onclick="editItem(${item.id})">Ред.</button>
                    <button type="button" class="btn btn-danger" onclick="deleteItem(${item.id})">Вид.</button>
                </td>
            </tr>
        `).join("");
    }
    window.editItem = function(id) {
        const item = loadProducts().find(p => p.id === id);
        if (!item) return;
        idInput.value = item.id;
        document.getElementById("itemName").value = item.name;
        document.getElementById("itemCategory").value = item.category;
        document.getElementById("itemManufacturer").value = item.manufacturer;
        document.getElementById("itemDimensions").value = item.dimensions;
        document.getElementById("itemMaterial").value = item.material;
        document.getElementById("itemPrice").value = item.price;
        document.getElementById("itemDesc").value = item.description;
        heading.textContent = "Редагувати товар (ID: " + item.id + ")";
        cancelBtn.style.display = "inline-block";
    };
    window.deleteItem = function(id) {
        if (!confirm("Видалити запис із бази?")) return;
        const updated = loadProducts().filter(p => p.id !== id);
        saveProducts(updated);
        renderTable();
    };
    cancelBtn.addEventListener("click", () => {
        form.reset();
        idInput.value = "";
        heading.textContent = "Додати товар";
        cancelBtn.style.display = "none";
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameEl = document.getElementById("itemName");
        const manEl = document.getElementById("itemManufacturer");
        const dimEl = document.getElementById("itemDimensions");
        const matEl = document.getElementById("itemMaterial");
        const priceEl = document.getElementById("itemPrice");
        const descEl = document.getElementById("itemDesc");
        const rules = [
            [nameEl, nameEl.value.trim().length >= 2],
            [manEl, manEl.value.trim().length >= 2],
            [dimEl, dimEl.value.trim().length >= 3],
            [matEl, matEl.value.trim().length >= 3],
            [priceEl, Number(priceEl.value) > 0],
            [descEl, descEl.value.trim().length >= 10]
        ];
        let valid = true;
        rules.forEach(([el, ok]) => {
            const row = el.closest(".form-row");
            if (ok) row.classList.remove("has-error");
            else {
                row.classList.add("has-error");
                valid = false;
            }
        });
        if (!valid) return;
        const products = loadProducts();
        const editId = Number(idInput.value);
        const existingItem = products.find(p => p.id === editId);
        const newItem = {
            id: editId || (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1),
            name: nameEl.value.trim(),
            category: document.getElementById("itemCategory").value,
            manufacturer: manEl.value.trim(),
            dimensions: dimEl.value.trim(),
            material: matEl.value.trim(),
            price: Number(priceEl.value),
            image: existingItem ? existingItem.image : "images/divan.jpg",
            description: descEl.value.trim()
        };
        if (editId) {
            const index = products.findIndex(p => p.id === editId);
            if (index !== -1) products[index] = newItem;
        } else {
            products.push(newItem);
        }
        saveProducts(products);
        form.reset();
        idInput.value = "";
        heading.textContent = "Додати товар";
        cancelBtn.style.display = "none";
        renderTable();
    });
    renderTable();
}
document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    initAuth();
    initCatalog();
    initProductDetails();
    initAdmin();
});