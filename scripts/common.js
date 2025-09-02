
/*
 * Проверяет ответ пользователя и отображает результат
 * @param {HTMLInputElement} inputElement - элемент ввода ответа
 * @param {string} correctAnswer - правильный ответ
 * @param {HTMLElement} listItem - элемент задачи в списке
 */
export function checkAnswer(inputElement, correctAnswer, listItem) {
    const userAnswer = inputElement.value.trim().toLowerCase();
    let resultMessage = listItem.querySelector('.result-message');
    
    if (!resultMessage) {
        resultMessage = document.createElement('p');
        resultMessage.classList.add('result-message');
        listItem.appendChild(resultMessage);
    }
    
    const decisionButton = listItem.querySelector('.decision-button');
    if (decisionButton) {
        decisionButton.style.display = 'inline-block';
    }

    if (userAnswer === '') {
        resultMessage.textContent = `Вы не ввели ответ. Правильный ответ: ${correctAnswer}`;
        resultMessage.classList.remove('correct');
        resultMessage.classList.add('incorrect');
    } else if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Правильно!';
        resultMessage.classList.remove('incorrect');
        resultMessage.classList.add('correct');
    } else {
        resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
        resultMessage.classList.remove('correct');
        resultMessage.classList.add('incorrect');
    }
}

/*
 * Показывает/скрывает решение задачи
 * @param {string} decisionImage - путь к изображению с решением
 * @param {HTMLElement} listItem - элемент задачи в списке
 */
export function showDecision(decisionImage, listItem) {
    let existingImage = listItem.querySelector('.solution-image');
    if (existingImage) {
        existingImage.remove();
        return;
    }
    
    const image = document.createElement('img');
    image.src = decisionImage;
    image.alt = 'Решение';
    image.classList.add('solution-image');
    listItem.appendChild(image);
}

/*
 * Загружает данные задач из JSON файла
 * @returns {Promise<Object>} - промис с данными задач
 */
export async function loadQuizData() {
    const container = document.getElementById("quiz-container") || document.getElementById("data-container");
    const dataFile = container.getAttribute("data-quiz-file") || container.getAttribute("data-file");
    
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
 * Настраивает размер изображения в зависимости от устройства
 * @param {HTMLImageElement} image - элемент изображения
 * @param {HTMLElement} parentElement - родительский элемент
 */
export function adjustImageSize(image, parentElement) {
    image.onload = () => {
        const originalWidth = image.width;
        const isMobile = window.innerWidth <= 768;

        if (isMobile && originalWidth >= 1500) {
            image.style.maxWidth = '90vw';
            image.style.height = 'auto';
        } 
        else if (isMobile && originalWidth < 1500) {
            image.style.maxWidth = '33vw';
            image.style.height = 'auto';
        } 
        else {
            image.style.maxWidth = 'auto';
            image.style.maxHeight = 'auto';
        }
    };
}

/*
 * Создает базовые DOM-элементы для отображения задач
 * @returns {Object} - объект с созданными элементами
 
  */
export function createBaseElements() {
    const mainContainer = document.querySelector('main');
    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');
    mainContainer.appendChild(tasksContainer);
    
    return { mainContainer, tasksContainer };
}

/*
 * Подсчитывает и отображает результаты теста
 * @param {Array} tasks - массив задач
 * @param {HTMLElement} container - контейнер с задачами
 * @param {HTMLElement} scoreDisplay - элемент для отображения результата
 */
export function calculateScore(tasks, container, scoreDisplay) {
    let correctAnswersCount = 0;
    const taskItems = container.querySelectorAll('.task-item');
    
    taskItems.forEach((listItem, index) => {
        const input = listItem.querySelector('.answer-input');
        const task = tasks[index];
        
        if (task && input) {
            checkAnswer(input, task.correctAnswer, listItem);
            if (input.value.trim().toLowerCase() === task.correctAnswer) {
                correctAnswersCount++;
            }
        }
    });

    scoreDisplay.textContent = `Вы ответили правильно на ${correctAnswersCount} из ${tasks.length} заданий.`;
    scoreDisplay.style.display = 'block';
}