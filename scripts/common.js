/*
 * Проверяет ответ пользователя и отображает результат
 */
export function checkAnswer(inputElement, correctAnswer, listItem) {
  const userAnswer = inputElement.value.trim().toLowerCase();
  let resultMessage = listItem.querySelector(".result-message");

  if (!resultMessage) {
    resultMessage = document.createElement("p");
    resultMessage.classList.add("result-message");
    listItem.appendChild(resultMessage);
  }

  const decisionButton = listItem.querySelector(".decision-button");
  if (decisionButton) {
    decisionButton.style.display = "inline-block";
  }

  if (userAnswer === "") {
    resultMessage.textContent = `Вы не ввели ответ. Правильный ответ: ${correctAnswer}`;
    resultMessage.classList.remove("correct");
    resultMessage.classList.add("incorrect");
  } else if (userAnswer === correctAnswer) {
    resultMessage.textContent = "Правильно!";
    resultMessage.classList.remove("incorrect");
    resultMessage.classList.add("correct");
  } else {
    resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
    resultMessage.classList.remove("correct");
    resultMessage.classList.add("incorrect");
  }
}

/*
 * Показывает/скрывает решение задачи
 */
export function showDecision(decisionImage, listItem) {
  let existingImage = listItem.querySelector(".solution-image");
  if (existingImage) {
    existingImage.remove();
    return;
  }

  const image = document.createElement("img");
  image.src = decisionImage;
  image.alt = "Решение";
  image.classList.add("solution-image");
  listItem.appendChild(image);
}

/*
 * Загружает данные задач из JSON файла
 */
export async function loadQuizData() {
  const container =
    document.getElementById("quiz-container") ||
    document.getElementById("data-container");
  const dataFile =
    container.getAttribute("data-quiz-file") ||
    container.getAttribute("data-file");

  try {
    const response = await fetch(dataFile);
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return { themes: [] }; // Возвращаем объект с пустым массивом тем для совместимости
  }
}

/*
 * Создает базовые DOM-элементы для отображения задач
 */
export function createBaseElements() {
  const mainContainer = document.querySelector("main");
  const tasksContainer = document.createElement("div");
  tasksContainer.classList.add("tasks-container");
  mainContainer.appendChild(tasksContainer);

  return { mainContainer, tasksContainer };
}
