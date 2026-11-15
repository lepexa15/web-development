//Завданя 2 
let slideIndex1 = 1;
window.addEventListener('load', function() {
    showSlides1(slideIndex1);
    showSlides2(slideIndex2);
});
function plusSlide1() { showSlides1(slideIndex1 += 1); }
function minusSlide1() { showSlides1(slideIndex1 -= 1); }
function currentSlide1(n) { showSlides1(slideIndex1 = n); }
function showSlides1(n) {
    let slides = document.querySelectorAll(".slider .item");
    let dots = document.querySelectorAll(".slider-dots_item-1");
    if (slides.length === 0) return;
    if (n > slides.length) slideIndex1 = 1;
    if (n < 1) slideIndex1 = slides.length;
    for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
    for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
    slides[slideIndex1 - 1].style.display = "block";
    if (dots.length > 0) dots[slideIndex1 - 1].className += " active";
}
//Завдання 3
let slideIndex2 = 1;
function plusSlide2() { showSlides2(slideIndex2 += 1); }
function minusSlide2() { showSlides2(slideIndex2 -= 1); }
function currentSlide2(n) { showSlides2(slideIndex2 = n); }
function showSlides2(n) {
    let slides = document.querySelectorAll(".slider-variant8 .item");
    let dots = document.querySelectorAll(".slider-dots_item-2");
    if (slides.length === 0) return;
    if (n > slides.length) slideIndex2 = 1;
    if (n < 1) slideIndex2 = slides.length;
    for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
    for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
    slides[slideIndex2 - 1].style.display = "block";
    if (dots.length > 0) dots[slideIndex2 - 1].className += " active";
}
//Завдання 1
function info_for_tab(tabNum) {
    let contentBox = document.getElementById('tab-content-box');
    if (!contentBox) return;
    if (tabNum === 1) {
        contentBox.innerHTML = '<h3 style="color:#0056b3;">М\'які меблі</h3><p>Прямі та кутові дивани, м\'які крісла, пуфи та комфортні ліжка</p><img src="img/tab1.jpg" alt="М\'які меблі">';
        contentBox.style.backgroundColor = '#e6f2ff';
    } else if (tabNum === 2) {
        contentBox.innerHTML = '<h3 style="color:#28a745;">Корпусні меблі</h3><p>Сучасні стінки, шафи-купе, місткі комоди, стелажі для організації простору</p><img src="img/tab2.jpg" alt="Корпусні меблі">';
        contentBox.style.backgroundColor = '#e6ffe6';
    } else if (tabNum === 3) {
        contentBox.innerHTML = '<h3 style="color:#fd7e14;">Для кухні</h3><p>Кухонні гарнітури, зручні обідні столи, стільці та куточки для сімейних обідів.</p><img src="img/tab3.jpg" alt="Кухні">';
        contentBox.style.backgroundColor = '#fff3e6';
    } else if (tabNum === 4) {
        contentBox.innerHTML = '<h3 style="color:#6f42c1;">Офісні меблі</h3><p>Функціональні комп\'ютерні столи, ергономічні офісні крісла та мобільні тумби.</p><img src="img/tab4.jpg" alt="Офісні меблі">';
        contentBox.style.backgroundColor = '#f4e6ff';
    } else if (tabNum === 5) {
        contentBox.innerHTML = '<h3 style="color:#dc3545;">Декор та аксесуари</h3><p>Настінні годинники, стильне освітлення, килими та декоративні елементи.</p><img src="img/tab5.jpg" alt="Декор">';
        contentBox.style.backgroundColor = '#ffe6e6';
    }
}
//Завдання 4 та 5
function validateForm() {
    let name = document.forms['regForm']['fullName'].value;
    let email = document.forms['regForm']['email'].value;
    let password = document.forms['regForm']['password'].value;
    document.getElementById('nameError').innerHTML = '';
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('passError').innerHTML = '';
    let isValid = true;
    if (name.trim() === "") {
        document.getElementById('nameError').innerHTML = '* Дане поле обов’язкове для заповнення';
        isValid = false;
    }
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let at = email.indexOf("@");
    let dot = email.indexOf(".");
    if (email.trim() === "") {
        document.getElementById('emailError').innerHTML = '* Email поле не може бути пустим';
        isValid = false;
    } else if (at < 1 || dot < 1 || !email.match(emailRegex)) {
        document.getElementById('emailError').innerHTML = '* Email введено невірно (має містити @ та крапку)';
        isValid = false;
    }
    if (password === "") {
        document.getElementById('passError').innerHTML = '* Пароль обов’язковий для заповнення';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passError').innerHTML = '* Пароль повинен містити мінімум 6 символів';
        isValid = false;
    }
    if (!isValid) return false;
    alert("Дані введено коректно. Акаунт успішно створено");
    return true;
}
function validateLoginForm() {
    let email = document.forms['loginForm']['loginEmail'].value;
    let password = document.forms['loginForm']['loginPassword'].value;
    document.getElementById('loginEmailError').innerHTML = '';
    document.getElementById('loginPassError').innerHTML = '';
    let isValid = true;
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let at = email.indexOf("@");
    let dot = email.indexOf(".");
    if (email.trim() === "") {
        document.getElementById('loginEmailError').innerHTML = '* Введіть електронну пошту';
        isValid = false;
    } else if (at < 1 || dot < 1 || !email.match(emailRegex)) {
        document.getElementById('loginEmailError').innerHTML = '* Email введено невірно (має містити @ та крапку)';
        isValid = false;
    }
    if (password === "") {
        document.getElementById('loginPassError').innerHTML = '* Введіть пароль';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('loginPassError').innerHTML = '* Пароль повинен містити мінімум 6 символів';
        isValid = false;
    }
    if (!isValid) return false;
    alert("Авторизація пройшла успішно");
    return true;
}