async function generateVariant() {
  try {
    const response = await fetch('https://cloud.flowiseai.com/api/v1/prediction/3f36f232-040c-49ae-b640-51c05a2e9aea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: "generate variant"
      })
    });
    
    const data = await response.json();
    displayTasks(data.text);
    // console.log(data.text);
  } catch (error) {
    console.error('Ошибка генерации:', error);
  }
}
function displayTasks(aiText) {
    console.log("Полный ответ от ИИ:", aiText);
    
    // Очищаем все задачи
    for (let i = 1; i <= 5; i++) {
        const taskElement = document.getElementById(`task${i}`);
        if (taskElement) {
            taskElement.textContent = '';
        }
    }
    
    // Удаляем вступительный текст до первой "ЗАДАЧА 1:"
    const startIndex = aiText.indexOf('ЗАДАЧА 1:');
    let cleanText = aiText;
    
    if (startIndex !== -1) {
        cleanText = aiText.substring(startIndex);
    }
    
    // Разбиваем по "ЗАДАЧА X:" 
    const tasks = cleanText.split(/ЗАДАЧА\s*\d+:/).filter(task => task.trim());
    
    console.log("Найдено задач:", tasks.length);
    
    // Вставляем задачи начиная с первой
    tasks.forEach((taskText, index) => {
        const taskNumber = index + 1;
        const taskElement = document.getElementById(`task${taskNumber}`);
        if (taskElement) {
            // Убираем лишние пробелы и вставляем
            taskElement.textContent = taskText.trim();
            console.log(`Задача ${taskNumber}:`, taskText.trim());
        }
    });
}