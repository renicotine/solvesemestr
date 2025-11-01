import {
  checkAnswer,
  showDecision,
  loadQuizData,
  calculateScore,
} from "./common.js";

const variantsContainer = document.getElementById("variants-container");
const variantButtonsContainer = document.getElementById(
  "variant-buttons-container"
);
const submitVariantButton = document.getElementById("submit-variant-button");
const totalScoreDisplay = document.getElementById("total-score");

let currentVariantTasks = [];

// Функция для создания кнопок вариантов
async function createVariantButtons() {
  const quizData = await loadQuizData();
  variantButtonsContainer.innerHTML = "";

  quizData.variants.forEach((variant) => {
    const button = document.createElement("button");
    button.textContent = `Вариант ${variant.number}`;
    button.classList.add("variant-button");
    button.dataset.variant = variant.number;
    button.addEventListener("click", () => generateVariant(variant.number));
    variantButtonsContainer.appendChild(button);
  });
}

// Функция для генерации варианта
async function generateVariant(variantNumber) {
  const quizData = await loadQuizData();
  currentVariantTasks = [];
  variantsContainer.innerHTML = "";

  const variantData = quizData.variants.find((v) => v.number == variantNumber);

  if (!variantData) {
    variantsContainer.innerHTML = "<p>Вариант не найден</p>";
    return;
  }

  const variantContainer = document.createElement("div");
  variantContainer.classList.add("variant-container");

  const variantTitle = document.createElement("h2");
  variantTitle.textContent = `Вариант ${variantNumber}`;
  variantContainer.appendChild(variantTitle);

  const tasksContainer = document.createElement("div");
  tasksContainer.classList.add("tasks-container");

  variantData.tasks.forEach((task, index) => {
    currentVariantTasks.push(task);

    const taskElement = document.createElement("div");
    taskElement.classList.add("task-item");

    const taskHeader = document.createElement("h3");
    taskHeader.textContent = `Задание ${index + 1}`;
    taskElement.appendChild(taskHeader);

    const image = document.createElement("img");
    image.src = task.image;
    image.alt = `Задание ${index + 1}`;
    image.classList.add("task-image");
    taskElement.appendChild(image);

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите ответ";
    input.classList.add("answer-input");
    input.dataset.taskIndex = index;

    const decisionButton = document.createElement("button");
    decisionButton.textContent = "Показать решение";
    decisionButton.classList.add("decision-button");
    decisionButton.style.display = "none";
    decisionButton.addEventListener("click", () =>
      showDecision(task.decision, taskElement)
    );

    inputContainer.appendChild(input);
    inputContainer.appendChild(decisionButton);
    taskElement.appendChild(inputContainer);

    tasksContainer.appendChild(taskElement);
  });

  variantContainer.appendChild(tasksContainer);
  variantsContainer.appendChild(variantContainer);

  submitVariantButton.style.display = "inline-block";
  totalScoreDisplay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  createVariantButtons();
});

submitVariantButton.addEventListener("click", () => {
  calculateScore(currentVariantTasks, variantsContainer, totalScoreDisplay);
});
