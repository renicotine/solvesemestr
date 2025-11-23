// Импорт нужных функций

import {
  checkAnswer,
  showDecision,
  loadQuizData,
  createBaseElements,
} from "./common.js";

const { tasksContainer } = createBaseElements();

/*
 * Загружает список тем
 */
async function renderThemes() {
  // Загружаем данные с заданиями
  const quizData = await loadQuizData();

  // Если данных нет - выходим
  if (!quizData.themes?.length) {
    console.warn("Данные пусты или не загрузились!");
    return;
  }

  // Для каждой темы создаем свой блок
  quizData.themes.forEach((theme) => {
    const themeContainer = document.createElement("div");
    themeContainer.classList.add("theme-container", "collapsible");

    // Добавляем заголовок темы
    const themeTitle = document.createElement("h2");
    themeTitle.textContent = theme.name;
    themeTitle.classList.add("theme-title");
    themeContainer.appendChild(themeTitle);
    tasksContainer.appendChild(themeContainer);

    // При клике на тему - показываем или скрываем задания
    themeTitle.addEventListener("click", function (event) {
      // Проверяем открыта ли эта тема
      const isActive = themeContainer.classList.contains("active");

      // Закрываем все другие темы
      document.querySelectorAll(".collapsible").forEach((otherCollapsible) => {
        if (otherCollapsible !== themeContainer) {
          otherCollapsible.classList.remove("active");
          const content = otherCollapsible.querySelector(".content");
          if (content) content.remove();
        }
      });

      // Если тема была открыта - закрываем ее
      if (isActive) {
        themeContainer.classList.remove("active");
        const content = themeContainer.querySelector(".content");
        if (content) content.remove();
      } else {
        // Если тема была закрыта - открываем и показываем задания
        themeContainer.classList.add("active");
        const content = document.createElement("div");
        content.classList.add("content");
        themeContainer.appendChild(content);
        renderThemeContent(content, theme);
      }
    });
  });
}

/*
 * загружает контент темы
 */

async function renderThemeContent(contentContainer, themeData) {
  // Для каждой подтемы создаем список заданий
  themeData.subthemes.forEach((subtheme) => {
    const subthemeList = document.createElement("ul");
    subthemeList.classList.add("subtheme-list");

    // Название подтемы
    const subthemeTitle = document.createElement("h3");
    subthemeTitle.textContent = subtheme.name;
    contentContainer.appendChild(subthemeTitle);
    contentContainer.appendChild(subthemeList);

    // Для каждого задания создаем карточку
    subtheme.tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.classList.add("task-item");

      // Номер задания
      const taskNumber = document.createElement("span");
      taskNumber.textContent = `${task.number} `;
      taskNumber.classList.add("task-number");
      listItem.appendChild(taskNumber);

      // Контейнер для картинки с заданием
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("imgContainer");
      imgContainer.style.cssText =
        "overflow: hidden; display: flex; justify-content: center; align-items: center;";
      listItem.appendChild(imgContainer);

      // Картинка с заданием
      const image = document.createElement("img");
      image.src = task.image;
      image.alt = "задание";
      image.classList.add("task-image");

      imgContainer.appendChild(image);

      // Поле для ввода ответа
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Введите ответ";
      input.classList.add("answer-input");

      // Кнопка для проверки ответа
      const answerButton = document.createElement("button");
      answerButton.textContent = "Ответить";
      answerButton.classList.add("answer-button");
      answerButton.addEventListener("click", () =>
        checkAnswer(input, task.correctAnswer, listItem)
      );

      // Кнопка для показа решения
      const decisionButton = document.createElement("button");
      decisionButton.textContent = "Показать решение";
      decisionButton.classList.add("decision-button");
      decisionButton.style.display = "none"; // Сначала скрыта
      decisionButton.addEventListener("click", () =>
        showDecision(task.decision, listItem)
      );

      listItem.append(input, answerButton, decisionButton);
      subthemeList.appendChild(listItem);
    });
  });
}

// Когда страница загрузилась - показываем список тем
document.addEventListener("DOMContentLoaded", renderThemes);
