let productsList = [];
let activeCategory = "all";
let slideIndex = 1;
function getSavedProducts() {
    let data = localStorage.getItem("furniture_catalog_v2");
    if (data) {
        return JSON.parse(data);
    }
    return null;
}
// Поки тримаємо дані в localStorage, на етапі бекенду запис піде в MySQL
function saveProducts(list) {
    productsList = list;
    localStorage.setItem("furniture_catalog_v2", JSON.stringify(list));
}
// Стартове завантаження з JSON-файлу
function initData(callback) {
    let saved = getSavedProducts();
    if (saved) {
        productsList = saved;
        if (callback) callback();
        return;
    }
    fetch("products.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            saveProducts(data);
            if (callback) callback();
        })
        .catch(function() {
            productsList = [];
            if (callback) callback();
        });
}
// Перевірка статусу входу через localStorage
function updateNavigation() {
    let isAuth = localStorage.getItem("isAuth") === "1";
    let role = localStorage.getItem("userRole");
    let navAuth = document.getElementById("navAuth");
    let navAdmin = document.getElementById("navAdmin");
    let navLogout = document.getElementById("navLogout");
    let homeAuthBtn = document.getElementById("homeAuthBtn");
    let homeCatalogBtn = document.getElementById("homeCatalogBtn");
    if (navAuth) {
        navAuth.style.display = isAuth ? "none" : "block";
    }
    if (navLogout) {
        navLogout.style.display = isAuth ? "block" : "none";
    }
    if (navAdmin) {
        navAdmin.style.display = (isAuth && role === "admin") ? "block" : "none";
    }
    if (homeAuthBtn && homeCatalogBtn) {
        homeAuthBtn.style.display = isAuth ? "none" : "inline-block";
        homeCatalogBtn.style.display = isAuth ? "inline-block" : "none";
    }
}

// Вихід із системи на бекенді тут буде закриття сесії
function logoutUser() {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
}
// Слайдер на головній сторінці
function plusSlide(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let slides = document.querySelectorAll("#mainSlider .slide");
    let dots = document.querySelectorAll("#mainSlider .slider-dots_item");
    if (slides.length === 0) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    slides[slideIndex - 1].classList.add("active");
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add("active");
    }
}
// Переключення вкладок входу та реєстрації
function switchAuthTab(formId, btn) {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let tabButtons = document.querySelectorAll(".form-box .tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    btn.classList.add("active");
    if (formId === "loginForm") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}
function setFieldError(rowId, isValid) {
    let row = document.getElementById(rowId);
    if (!row) return isValid;
    if (isValid) {
        row.classList.remove("has-error");
    } else {
        row.classList.add("has-error");
    }
    return isValid;
}
function handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPassword").value;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let okEmail = setFieldError("loginEmailRow", emailPattern.test(email));
    let okPass = setFieldError("loginPassRow", pass.length >= 6);
    if (okEmail && okPass) {
        // Заглушка авторизації для макета; при підключенні PHP перевірка піде через БД
        localStorage.setItem("isAuth", "1");
        // Тимчасова перевірка адміна за поштою (потім роль підтягуватиметься з таблиці users)
        if (email.toLowerCase() === "admin@gmail.com") {
            localStorage.setItem("userRole", "admin");
            window.location.href = "admin.html";
        } else {
            localStorage.setItem("userRole", "user");
            window.location.href = "catalog.html";
        }
    }
    return false;
}
function handleRegister(e) {
    e.preventDefault();
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let phone = document.getElementById("regPhone").value.trim();
    let pass = document.getElementById("regPassword").value;
    let confirm = document.getElementById("regConfirm").value;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\+380\d{9}$/;
    let v1 = setFieldError("regNameRow", name.length >= 3);
    let v2 = setFieldError("regEmailRow", emailPattern.test(email));
    let v3 = setFieldError("regPhoneRow", phonePattern.test(phone));
    let v4 = setFieldError("regPassRow", pass.length >= 6);
    let v5 = setFieldError("regConfirmRow", confirm === pass && confirm.length >= 6);
    if (v1 && v2 && v3 && v4 && v5) {
        // Імітація реєстрації на клієнті (далі відправка форми у PHP та запис у базу)
        localStorage.setItem("isAuth", "1");
        localStorage.setItem("userRole", "user");
        alert("Реєстрація успішна. Виконано вхід у каталог");
        window.location.href = "catalog.html";
    }
    return false;
}
// Оновлення списку виробників на основі наявних товарів
function updateManufacturerFilter() {
    let select = document.getElementById("manufacturerFilter");
    if (!select) return;
    let currentVal = select.value;
    let manufacturers = [];
    for (let i = 0; i < productsList.length; i++) {
        let man = productsList[i].manufacturer;
        if (man && manufacturers.indexOf(man) === -1) {
            manufacturers.push(man);
        }
    }
    let html = '<option value="all">Усі виробники</option>';
    for (let i = 0; i < manufacturers.length; i++) {
        html += '<option value="' + manufacturers[i] + '">' + manufacturers[i] + '</option>';
    }
    select.innerHTML = html;
    if (manufacturers.indexOf(currentVal) !== -1) {
        select.value = currentVal;
    }
}
function selectCategory(btn, category) {
    let tabs = document.querySelectorAll("#categoryTabs .tab-btn");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    btn.classList.add("active");
    activeCategory = category;
    showCatalog();
}
function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("manufacturerFilter").value = "all";
    activeCategory = "all";
    let tabs = document.querySelectorAll("#categoryTabs .tab-btn");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    if (tabs.length > 0) {
        tabs[0].classList.add("active");
    }
    showCatalog();
}
// Фільтрація та вивід карток при великій базі відбір перенесеться в SQL-запит
function showCatalog() {
    let grid = document.getElementById("productsGrid");
    if (!grid) return;
    let query = document.getElementById("searchInput").value.trim().toLowerCase();
    let manufacturer = document.getElementById("manufacturerFilter").value;
    let filtered = [];
    for (let i = 0; i < productsList.length; i++) {
        let item = productsList[i];
        let matchCategory = false;
        let matchName = false;
        let matchManufacturer = false;
        if (activeCategory === "all" || item.category === activeCategory) {
            matchCategory = true;
        }
        if (query === "" || item.name.toLowerCase().indexOf(query) !== -1) {
            matchName = true;
        }
        if (manufacturer === "all" || item.manufacturer === manufacturer) {
            matchManufacturer = true;
        }
        if (matchCategory && matchName && matchManufacturer) {
            filtered.push(item);
        }
    }
    if (filtered.length === 0) {
        grid.innerHTML = "<p>Товарів не знайдено.</p>";
        return;
    }
    let html = "";
    for (let i = 0; i < filtered.length; i++) {
        let item = filtered[i];
        html += '<div class="product-card">';
        html += '<div>';
        html += '<img src="' + item.image + '" alt="' + item.name + '" class="product-img">';
        html += '<div class="product-meta">Категорія: ' + item.category + '</div>';
        html += '<h3>' + item.name + '</h3>';
        html += '<div class="product-meta">Виробник: <strong>' + item.manufacturer + '</strong></div>';
        html += '<div class="product-meta">Габарити: ' + item.dimensions + '</div>';
        html += '</div>';
        html += '<div>';
        html += '<div class="product-price">' + item.price + ' грн</div>';
        html += '<a href="product.html?id=' + item.id + '" class="btn btn-small">Детальніше</a>';
        html += '</div>';
        html += '</div>';
    }
    grid.innerHTML = html;
}
// Клієнтське обмеження доступу до каталогу на бекенді перевірятиметься сесія до завантаження сторінки
function initCatalogPage() {
    let catalogContent = document.getElementById("catalogContent");
    let accessDeniedBox = document.getElementById("accessDeniedBox");
    if (!catalogContent || !accessDeniedBox) return;
    let isAuth = localStorage.getItem("isAuth") === "1";
    if (!isAuth) {
        accessDeniedBox.style.display = "block";
        catalogContent.style.display = "none";
        return;
    }
    accessDeniedBox.style.display = "none";
    catalogContent.style.display = "block";
    initData(function() {
        updateManufacturerFilter();
        showCatalog();
    });
}
// Підтягуємо товар за id з адреси
function showProductDetails() {
    let container = document.getElementById("productDetails");
    if (!container) return;
    if (localStorage.getItem("isAuth") !== "1") {
        window.location.href = "auth.html";
        return;
    }
    initData(function() {
        let params = new URLSearchParams(window.location.search);
        let id = Number(params.get("id")) || 1;
        let item = productsList[0];
        for (let i = 0; i < productsList.length; i++) {
            if (productsList[i].id === id) {
                item = productsList[i];
                break;
            }
        }
        if (!item) return;
        let html = '';
        html += '<img src="' + item.image + '" alt="' + item.name + '" class="product-img-large">';
        html += '<div>';
        html += '<div class="product-meta">Категорія: ' + item.category + '</div>';
        html += '<h1>' + item.name + '</h1>';
        html += '<div class="product-price" style="font-size: 20px;">Ціна: ' + item.price + ' грн</div>';
        html += '<p>' + item.description + '</p>';
        html += '<table class="details-table">';
        html += '<tr><td>Виробник</td><td>' + item.manufacturer + '</td></tr>';
        html += '<tr><td>Габарити (Ш×Г×В)</td><td>' + item.dimensions + '</td></tr>';
        html += '<tr><td>Матеріал</td><td>' + item.material + '</td></tr>';
        html += '<tr><td>Код товару</td><td>#' + item.id + '</td></tr>';
        html += '</table>';
        html += '</div>';
        container.innerHTML = html;
    });
}
// Модуль адміністратора
function showAdminStatus(text) {
    let box = document.getElementById("adminStatus");
    if (!box) return;
    box.textContent = text;
    box.style.display = "block";
    setTimeout(function() {
        box.style.display = "none";
    }, 3000);
}
function showAdminTable() {
    let tbody = document.getElementById("adminTableBody");
    if (!tbody) return;
    let html = "";
    for (let i = 0; i < productsList.length; i++) {
        let item = productsList[i];
        html += '<tr>';
        html += '<td>' + item.id + '</td>';
        html += '<td>' + item.name + '</td>';
        html += '<td>' + item.category + '</td>';
        html += '<td>' + item.manufacturer + '</td>';
        html += '<td>' + item.price + ' грн</td>';
        html += '<td>';
        html += '<button type="button" class="btn btn-small" onclick="editItem(' + item.id + ')">Ред.</button> ';
        html += '<button type="button" class="btn btn-danger" onclick="deleteItem(' + item.id + ')">Вид.</button>';
        html += '</td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}
function editItem(id) {
    let item = null;
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id === id) {
            item = productsList[i];
            break;
        }
    }
    if (!item) return;
    document.getElementById("itemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemManufacturer").value = item.manufacturer;
    document.getElementById("itemDimensions").value = item.dimensions;
    document.getElementById("itemMaterial").value = item.material;
    document.getElementById("itemPrice").value = item.price;
    document.getElementById("itemImage").value = item.image;
    document.getElementById("itemDesc").value = item.description;
    document.getElementById("formHeading").textContent = "Редагувати товар (ID: " + item.id + ")";
    document.getElementById("cancelEdit").style.display = "inline-block";
}
// Видалення зі сховища браузера (потім - SQL-запит DELETE на сервері)
function deleteItem(id) {
    if (!confirm("Видалити запис із бази?")) return;
    let updated = [];
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id !== id) {
            updated.push(productsList[i]);
        }
    }
    saveProducts(updated);
    showAdminTable();
    showAdminStatus("Запис видалено з бази даних.");
}
function cancelAdminEdit() {
    document.getElementById("adminForm").reset();
    document.getElementById("itemId").value = "";
    document.getElementById("formHeading").textContent = "Додати товар";
    document.getElementById("cancelEdit").style.display = "none";
}
// Локальне додавання або оновлення запису на бекенді - обробка форми через PHP у таблицю товарів
function handleAdminSubmit(e) {
    e.preventDefault();
    let nameVal = document.getElementById("itemName").value.trim();
    let manVal = document.getElementById("itemManufacturer").value.trim();
    let dimVal = document.getElementById("itemDimensions").value.trim();
    let matVal = document.getElementById("itemMaterial").value.trim();
    let priceVal = Number(document.getElementById("itemPrice").value);
    let imgVal = document.getElementById("itemImage").value.trim();
    let descVal = document.getElementById("itemDesc").value.trim();
    let v1 = setFieldError("itemNameRow", nameVal.length >= 2);
    let v2 = setFieldError("itemManRow", manVal.length >= 2);
    let v3 = setFieldError("itemDimRow", dimVal.length >= 3);
    let v4 = setFieldError("itemMatRow", matVal.length >= 3);
    let v5 = setFieldError("itemPriceRow", priceVal > 0);
    let v6 = setFieldError("itemImageRow", imgVal.length >= 5);
    let v7 = setFieldError("itemDescRow", descVal.length >= 10);
    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7) {
        return false;
    }
    let editId = Number(document.getElementById("itemId").value);
    let maxId = 0;
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id > maxId) {
            maxId = productsList[i].id;
        }
    }
    let newItem = {
        id: editId ? editId : maxId + 1,
        name: nameVal,
        category: document.getElementById("itemCategory").value,
        manufacturer: manVal,
        dimensions: dimVal,
        material: matVal,
        price: priceVal,
        image: imgVal,
        description: descVal
    };
    if (editId) {
        for (let i = 0; i < productsList.length; i++) {
            if (productsList[i].id === editId) {
                productsList[i] = newItem;
                break;
            }
        }
    } else {
        productsList.push(newItem);
    }
    saveProducts(productsList);
    cancelAdminEdit();
    showAdminTable();
    showAdminStatus(editId ? "Зміни успішно збережено." : "Новий товар додано до бази даних.");
    return false;
}
// На етапі бекенду тут додасться серверна перевірка прав адміністратора
function initAdminPage() {
    let tbody = document.getElementById("adminTableBody");
    if (!tbody) return;
    initData(function() {
        showAdminTable();
    });
}
// Ініціалізація при завантаженні сторінки
updateNavigation();
initCatalogPage();
showProductDetails();
initAdminPage();
