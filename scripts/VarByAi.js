import { loadQuizData } from "./common.js";

const API_URL_71 =
  "https://cloud.flowiseai.com/api/v1/prediction/8263ee75-778b-480d-b622-0b4ddc6b44d0";
const API_URL_72 =
  "https://cloud.flowiseai.com/api/v1/prediction/9ba6935b-69bb-4c44-8d60-e7c033e9a334";

// Загружаем и показываем дефолтный вариант при загрузке страницы
async function loadDefaultVariant() {
  const quizData = await loadQuizData();

  if (quizData.variantText) {
    displayTasks(quizData.variantText);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const button71 = document.querySelector(".generate-button-71");
  const button72 = document.querySelector(".generate-button-72");

  if (button71) {
    button71.addEventListener("click", () => generateVariant(API_URL_71));
  }
  if (button72) {
    button72.addEventListener("click", () => generateVariant(API_URL_72));
  }
});

// Основная функция генерации
async function generateVariant(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: "Сгенерируй вариант",
      }),
    });

    const data = await response.json();
    console.log("sответ от ИИ");

    if (data && data.text) {
      displayTasks(data.text);
    }
  } catch (error) {
    console.error("Ошибка генерации:", error);
    // При ошибке перезагружаем дефолтный вариант
    loadDefaultVariant();
  }
}

// Функция отображения + парсинга задач
function displayTasks(aiText) {
  console.log("Полный ответ от ИИ:", aiText);
  // Очищаем задачи
  for (let i = 1; i <= 12; i++) {
    const taskElement = document.getElementById(`task${i}`);
    if (taskElement) taskElement.textContent = "";
  }

  // Удаляем текст до первой "ЗАДАЧА 1:"
  const startIndex = aiText.indexOf("ЗАДАЧА 1:");
  let cleanText = startIndex !== -1 ? aiText.substring(startIndex) : aiText;

  // Разбиваем по "ЗАДАЧА X:"
  const tasks = cleanText.split(/ЗАДАЧА\s*\d+:/).filter((task) => task.trim());

  // Вставляем задачи
  tasks.forEach((taskText, index) => {
    const taskNumber = index + 1;
    const taskElement = document.getElementById(`task${taskNumber}`);
    if (taskElement) {
      taskElement.textContent = taskText.trim();
      // console.log(`Задача ${taskNumber}:`, taskText.trim());
    }
  });

  if (window.MathJax) {
    MathJax.typesetPromise?.();
  }
}

// Загружаем дефолтный вариант при старте
document.addEventListener("DOMContentLoaded", loadDefaultVariant);
