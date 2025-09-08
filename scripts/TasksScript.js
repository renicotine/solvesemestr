import { checkAnswer, showDecision, loadQuizData,  createBaseElements } from './common.js';

const { tasksContainer } = createBaseElements();

async function renderThemes() {
    const quizData = await loadQuizData();
    
    if (!quizData.themes?.length) {
        console.warn("Данные пусты или не загрузились!");
        return;
    }

    quizData.themes.forEach(theme => {
        const themeContainer = document.createElement('div');
        themeContainer.classList.add('theme-container', 'collapsible');
        
        const themeTitle = document.createElement('h2');
        themeTitle.textContent = theme.name;
        themeTitle.classList.add('theme-title');
        themeContainer.appendChild(themeTitle);
        tasksContainer.appendChild(themeContainer);

        themeTitle.addEventListener('click', function(event) {
            const isActive = themeContainer.classList.contains('active');
            document.querySelectorAll('.collapsible').forEach(otherCollapsible => {
                if (otherCollapsible !== themeContainer) {
                    otherCollapsible.classList.remove('active');
                    const content = otherCollapsible.querySelector('.content');
                    if (content) content.remove();
                }
            });

            if (isActive) {
                themeContainer.classList.remove('active');
                const content = themeContainer.querySelector('.content');
                if (content) content.remove();
            } else {
                themeContainer.classList.add('active');
                const content = document.createElement('div');
                content.classList.add('content');
                themeContainer.appendChild(content);
                renderThemeContent(content, theme);
            }
        });
    });
}

async function renderThemeContent(contentContainer, themeData) {

    themeData.subthemes.forEach(subtheme => {
        const subthemeList = document.createElement('ul');
        subthemeList.classList.add('subtheme-list');
        const subthemeTitle = document.createElement('h3');
        subthemeTitle.textContent = subtheme.name;
        contentContainer.appendChild(subthemeTitle);
        contentContainer.appendChild(subthemeList);

        subtheme.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');

            const taskNumber = document.createElement('span');
            taskNumber.textContent = `${task.number} `;
            taskNumber.classList.add('task-number');
            listItem.appendChild(taskNumber);

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer');
            imgContainer.style.cssText = 'overflow: hidden; display: flex; justify-content: center; align-items: center;';
            listItem.appendChild(imgContainer);

            const image = document.createElement('img');
            image.src = task.image;
            image.alt = 'задание';
            image.classList.add('task-image');
            

            imgContainer.appendChild(image);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите ответ';
            input.classList.add('answer-input');

            const answerButton = document.createElement('button');
            answerButton.textContent = 'Ответить';
            answerButton.classList.add('answer-button');
            answerButton.addEventListener('click', () => checkAnswer(input, task.correctAnswer, listItem));

            const decisionButton = document.createElement('button');
            decisionButton.textContent = 'Показать решение';
            decisionButton.classList.add('decision-button');
            decisionButton.style.display = 'none';
            decisionButton.addEventListener('click', () => showDecision(task.decision, listItem));

            listItem.append(input, answerButton, decisionButton);
            subthemeList.appendChild(listItem);
        });
    });
}

document.addEventListener('DOMContentLoaded', renderThemes);