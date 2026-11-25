let productsList = [];
let activeCategory = "all";
let slideIndex = 1;

// Резервний масив на випадок запуску сторінки напряму без локального сервера
let fallbackProducts = [
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

function getSavedProducts() {
    let data = localStorage.getItem("furniture_catalog_v2");
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

function saveProducts(list) {
    productsList = list;
    localStorage.setItem("furniture_catalog_v2", JSON.stringify(list));
}

// Завантаження даних із файлу products.json засобами jQuery
function loadJsonData(callback) {
    $.getJSON("products.json", function(data) {
        productsList = data;
        if (callback) callback();
    }).fail(function() {
        let saved = getSavedProducts();
        if (saved) {
            productsList = saved;
        } else {
            productsList = fallbackProducts;
        }
        if (callback) callback();
    });
}

// Оновлення навігації залежно від статусу входу
function updateNavigation() {
    let isAuth = localStorage.getItem("isAuth") === "1";
    let role = localStorage.getItem("userRole");

    if (isAuth) {
        $("#navAuth").hide();
        $("#navLogout").show();
        $("#homeAuthBtn").hide();
        $("#homeCatalogBtn").show();
    } else {
        $("#navAuth").show();
        $("#navLogout").hide();
        $("#homeAuthBtn").show();
        $("#homeCatalogBtn").hide();
    }

    if (isAuth && role === "admin") {
        $("#navAdmin").show();
    } else {
        $("#navAdmin").hide();
    }
}

function logoutUser() {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
}

// Слайдер на головній сторінці з ефектами jQuery
function plusSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = $("#mainSlider .slide");
    let dots = $("#mainSlider .slider-dots_item");
    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    slides.hide().removeClass("active");
    dots.removeClass("active");

    slides.eq(slideIndex - 1).fadeIn(300).addClass("active");
    dots.eq(slideIndex - 1).addClass("active");
}

// Перемикання вкладок входу та реєстрації
function switchAuthTab(formId, btn) {
    $(".form-box .tab-btn").removeClass("active");
    $(btn).addClass("active");

    if (formId === "loginForm") {
        $("#registerForm").hide();
        $("#loginForm").fadeIn(200);
    } else {
        $("#loginForm").hide();
        $("#registerForm").fadeIn(200);
    }
}

function setFieldError(rowId, isValid) {
    let row = $("#" + rowId);
    if (row.length === 0) return isValid;

    if (isValid) {
        row.removeClass("has-error");
    } else {
        row.addClass("has-error");
    }
    return isValid;
}

function handleLogin(e) {
    e.preventDefault();
    let email = $("#loginEmail").val().trim();
    let pass = $("#loginPassword").val();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let okEmail = setFieldError("loginEmailRow", emailPattern.test(email));
    let okPass = setFieldError("loginPassRow", pass.length >= 6);

    if (okEmail && okPass) {
        localStorage.setItem("isAuth", "1");
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
    let name = $("#regName").val().trim();
    let email = $("#regEmail").val().trim();
    let phone = $("#regPhone").val().trim();
    let pass = $("#regPassword").val();
    let confirm = $("#regConfirm").val();

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\+380\d{9}$/;

    let v1 = setFieldError("regNameRow", name.length >= 3);
    let v2 = setFieldError("regEmailRow", emailPattern.test(email));
    let v3 = setFieldError("regPhoneRow", phonePattern.test(phone));
    let v4 = setFieldError("regPassRow", pass.length >= 6);
    let v5 = setFieldError("regConfirmRow", confirm === pass && confirm.length >= 6);

    if (v1 && v2 && v3 && v4 && v5) {
        localStorage.setItem("isAuth", "1");
        localStorage.setItem("userRole", "user");
        alert("Реєстрація успішна. Виконано вхід у каталог");
        window.location.href = "catalog.html";
    }
    return false;
}

// Заповнення списку виробників засобами jQuery
function updateManufacturerFilter() {
    let select = $("#manufacturerFilter");
    if (select.length === 0) return;

    let manufacturers = [];
    for (let i = 0; i < productsList.length; i++) {
        let man = productsList[i].manufacturer;
        if (man && manufacturers.indexOf(man) === -1) {
            manufacturers.push(man);
        }
    }

    select.empty();
    select.append('<option value="all">Усі виробники</option>');

    for (let i = 0; i < manufacturers.length; i++) {
        select.append('<option value="' + manufacturers[i] + '">' + manufacturers[i] + '</option>');
    }
}

// Вибір категорії меблів
function selectCategory(btn, category) {
    $("#categoryTabs .tab-btn").removeClass("active");
    $(btn).addClass("active");
    activeCategory = category;
    showCatalog();
}

// Скидання фільтрів
function resetFilters() {
    $("#searchInput").val("");
    $("#manufacturerFilter").val("all");
    activeCategory = "all";

    $("#categoryTabs .tab-btn").removeClass("active");
    $("#categoryTabs .tab-btn").first().addClass("active");

    showCatalog();
}

// Пошук, фільтрація та виведення карток товарів засобами jQuery
function showCatalog() {
    let grid = $("#productsGrid");
    if (grid.length === 0) return;

    let query = $("#searchInput").val().trim().toLowerCase();
    let manufacturer = $("#manufacturerFilter").val();
    let filtered = [];

    for (let i = 0; i < productsList.length; i++) {
        let item = productsList[i];
        let matchCategory = (activeCategory === "all" || item.category === activeCategory);
        let matchName = (query === "" || item.name.toLowerCase().indexOf(query) !== -1);
        let matchManufacturer = (manufacturer === "all" || item.manufacturer === manufacturer);

        if (matchCategory && matchName && matchManufacturer) {
            filtered.push(item);
        }
    }

    grid.empty();

    if (filtered.length === 0) {
        grid.append("<p>Товарів не знайдено.</p>");
        return;
    }

    for (let i = 0; i < filtered.length; i++) {
        let item = filtered[i];
        let html = '<div class="product-card">';
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

        grid.append(html);
    }

    $(".product-card").hide().fadeIn(250);
}

// Ініціалізація сторінки каталогу
function initCatalogPage() {
    if ($("#catalogContent").length === 0) return;

    // Для демонстрації ЛР №11 каталог відкривається одразу без блокування для гостей
    $("#accessDeniedBox").hide();
    $("#catalogContent").show();

    loadJsonData(function() {
        updateManufacturerFilter();
        showCatalog();
    });
}

// Детальна сторінка товару за ID
function showProductDetails() {
    let container = $("#productDetails");
    if (container.length === 0) return;

    loadJsonData(function() {
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

        container.html(html).hide().fadeIn(250);
    });
}

// Модуль адміністратора
function showAdminStatus(text) {
    let box = $("#adminStatus");
    if (box.length === 0) return;

    box.text(text).fadeIn(200);
    setTimeout(function() {
        box.fadeOut(300);
    }, 3000);
}

function showAdminTable() {
    let tbody = $("#adminTableBody");
    if (tbody.length === 0) return;

    tbody.empty();
    for (let i = 0; i < productsList.length; i++) {
        let item = productsList[i];
        let html = '<tr>';
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

        tbody.append(html);
    }
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

    $("#itemId").val(item.id);
    $("#itemName").val(item.name);
    $("#itemCategory").val(item.category);
    $("#itemManufacturer").val(item.manufacturer);
    $("#itemDimensions").val(item.dimensions);
    $("#itemMaterial").val(item.material);
    $("#itemPrice").val(item.price);
    $("#itemImage").val(item.image);
    $("#itemDesc").val(item.description);
    $("#formHeading").text("Редагувати товар (ID: " + item.id + ")");
    $("#cancelEdit").show();
}

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
    $("#adminForm")[0].reset();
    $("#itemId").val("");
    $("#formHeading").text("Додати товар");
    $("#cancelEdit").hide();
}

function handleAdminSubmit(e) {
    e.preventDefault();
    let nameVal = $("#itemName").val().trim();
    let manVal = $("#itemManufacturer").val().trim();
    let dimVal = $("#itemDimensions").val().trim();
    let matVal = $("#itemMaterial").val().trim();
    let priceVal = Number($("#itemPrice").val());
    let imgVal = $("#itemImage").val().trim();
    let descVal = $("#itemDesc").val().trim();

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

    let editId = Number($("#itemId").val());
    let maxId = 0;
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id > maxId) {
            maxId = productsList[i].id;
        }
    }

    let newItem = {
        id: editId ? editId : maxId + 1,
        name: nameVal,
        category: $("#itemCategory").val(),
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

function initAdminPage() {
    if ($("#adminTableBody").length === 0) return;

    let saved = getSavedProducts();
    if (saved) {
        productsList = saved;
        showAdminTable();
    } else {
        loadJsonData(function() {
            saveProducts(productsList);
            showAdminTable();
        });
    }
}

$(document).ready(function() {
    updateNavigation();
    initCatalogPage();
    showProductDetails();
    initAdminPage();
});