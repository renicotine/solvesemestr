/*
 Показывает меню на странице
*/

async function renderMenu() {
  const dropdownToggle = document.querySelector(".dropdown");

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  dropdownContent.innerHTML = `
    <a href="Menu.html">На главную</a>  
    <a href="Theory.html">Теория</a>
    <a href="Conditions.html">Условия</a>
    <a href="Tasks.html">Тренажер</a>
    <a href="Variants.html">Варианты</a>
    <a href="VarByAi.html">Варианты от ИИ</a>
  `;

  dropdownToggle.appendChild(dropdownContent);
}

document.addEventListener("DOMContentLoaded", renderMenu);
