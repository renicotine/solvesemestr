import { checkAnswer, showDecision, loadQuizData, calculateScore } from './common.js';

const semesterVariantsContainer = document.getElementById('semester-variants');
const generateButtons = document.querySelectorAll('.generate-button');
const submitSemesterButton = document.getElementById('submit-semester-button');
const totalScoreDisplay = document.getElementById('total-score');

let currentVariantTasks = [];

async function generateSemesterVariant(variantNumber) {
    const quizData = await loadQuizData();
    currentVariantTasks = [];
    semesterVariantsContainer.innerHTML = '';
    
    const variantContainer = document.createElement('div');
    variantContainer.classList.add('tasks-container');
    
    const themeContainer = document.createElement('div');
    themeContainer.classList.add('theme-container');
    
    const variantTitle = document.createElement('h2');
    variantTitle.textContent = `Вариант ${variantNumber}`;
    
    themeContainer.appendChild(variantTitle);
    variantContainer.appendChild(themeContainer);
    semesterVariantsContainer.appendChild(variantContainer);
    
    let taskNumberInVariant = 1;
    
    quizData.themes.forEach(theme => {
        theme.subthemes.forEach(subtheme => {
            const subthemeList = document.createElement('ul');
            subthemeList.classList.add('subtheme-list');
            const subthemeTitle = document.createElement('h4');
            const taskNumber = document.createElement('span');
            taskNumber.textContent = `${taskNumberInVariant}. `;
            taskNumber.classList.add('subtheme-number');
            subthemeTitle.append(taskNumber, subtheme.name);

            const taskForVariant = subtheme.tasks.find(task => task.number == variantNumber);
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            
            if (taskForVariant) {
                currentVariantTasks.push(taskForVariant);
                const image = document.createElement('img');
                image.src = taskForVariant.image;
                image.alt = 'задание';
                image.classList.add('task-image');
                
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Введите ответ';
                input.classList.add('answer-input');

                const decisionButton = document.createElement('button');
                decisionButton.textContent = 'Показать решение';
                decisionButton.classList.add('decision-button');
                decisionButton.style.display = 'none';
                decisionButton.addEventListener('click', () => showDecision(taskForVariant.decision, listItem));

                listItem.append(image, input, decisionButton);
            } else {
                listItem.textContent = 'Задание для данного варианта не найдено';
            }
            
            themeContainer.append(subthemeTitle, subthemeList);
            subthemeList.appendChild(listItem);
            taskNumberInVariant++;
        });
    });
    
    submitSemesterButton.style.display = 'inline-block';
    totalScoreDisplay.style.display = 'none';
}

generateButtons.forEach(button => {
    button.addEventListener('click', () => generateSemesterVariant(button.dataset.variant));
});

submitSemesterButton.addEventListener('click', () => {
    calculateScore(currentVariantTasks, semesterVariantsContainer, totalScoreDisplay);
});