// Импорт нужных функций

import { loadQuizData, createBaseElements } from "./common.js";

const { tasksContainer } = createBaseElements();

/*
 * Загружает список тем
 */
async function renderThemes() {
  const quizData = await loadQuizData();

  if (!quizData.themes?.length) {
    console.warn("Данные пусты или не загрузились!");
    tasksContainer.innerHTML =
      '<p class="no-data">Теоретические материалы пока не добавлены.</p>';
    return;
  }

  // Создаем интерактивные контейнеры для каждой темы
  quizData.themes.forEach((theme) => {
    const themeContainer = document.createElement("div");
    themeContainer.classList.add("theme-container", "collapsible");

    const themeTitle = document.createElement("h2");
    themeTitle.textContent = theme.name;
    themeTitle.classList.add("theme-title");
    themeContainer.appendChild(themeTitle);
    tasksContainer.appendChild(themeContainer);

    // Обрабатываем клик по заголовку темы (открытие/закрытие)
    themeTitle.addEventListener("click", function (event) {
      const isActive = themeContainer.classList.contains("active");

      // Закрываем все остальные открытые темы
      document
        .querySelectorAll(".theme-container.collapsible")
        .forEach((otherCollapsible) => {
          if (otherCollapsible !== themeContainer) {
            otherCollapsible.classList.remove("active");
            const content = otherCollapsible.querySelector(".theme-content");
            if (content) content.remove();
          }
        });

      // Открываем или закрываем текущую тему
      if (isActive) {
        themeContainer.classList.remove("active");
        const content = themeContainer.querySelector(".theme-content");
        if (content) content.remove();
      } else {
        themeContainer.classList.add("active");
        const content = document.createElement("div");
        content.classList.add("theme-content");
        themeContainer.appendChild(content);
        renderThemeContent(content, theme);
      }
    });
  });
}

/*
 * Загружает контент темы
 */

function renderThemeContent(contentContainer, themeData) {
  // Для каждой подтемы создаем раздел с заголовком и сеткой контента
  themeData.subthemes.forEach((subtheme) => {
    const subthemeSection = document.createElement("div");
    subthemeSection.classList.add("subtheme-section");

    const subthemeTitle = document.createElement("h3");
    subthemeTitle.textContent = subtheme.name;
    subthemeTitle.classList.add("subtheme-title");
    subthemeSection.appendChild(subthemeTitle);

    const contentGrid = document.createElement("div");
    contentGrid.classList.add("content-grid");

    // Добавляем все изображения из подтемы в сетку
    subtheme.content.forEach((contentItem) => {
      if (contentItem.type === "image") {
        const imageCard = document.createElement("div");
        imageCard.classList.add("image-card");

        const img = document.createElement("img");
        img.src = contentItem.src;
        img.classList.add("theory-image");
        img.loading = "lazy";

        imageCard.appendChild(img);

        contentGrid.appendChild(imageCard);
      }
    });

    subthemeSection.appendChild(contentGrid);
    contentContainer.appendChild(subthemeSection);
  });
}

document.addEventListener("DOMContentLoaded", renderThemes);
