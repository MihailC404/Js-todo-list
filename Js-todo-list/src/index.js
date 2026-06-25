import { getTodosFromDB, addTodoToDB, deleteTodoFromDB, updateTodoStatusInDB } from './services/supabase.js';

const todoInput = document.querySelector('.new-todo');
const todoList = document.querySelector('.todo-list');
const todoCount = document.querySelector('.todo-count strong');

// 1. Загрузка всех задач из базы данных при старте приложения
async function init() {
    try {
        const todos = await getTodosFromDB();
        todoList.innerHTML = ''; // Очищаем список перед рендером
        
        // Перебираем массив задач и отрисовываем каждую на экране
        todos.forEach(todo => renderTodo(todo));
        updateCount();
    } catch (err) {
        console.error('Не удалось загрузить задачи:', err);
        alert('Ошибка при загрузке данных из базы: ' + err.message);
    }
}

// 2. Отслеживание нажатия Enter для создания новой задачи
todoInput.addEventListener('keydown', async (e) => {
    const text = todoInput.value.trim();
    
    if (e.key === 'Enter' && text !== '') {
        try {
            // Отправляем задачу в Supabase
            const responseData = await addTodoToDB(text);
            
            // Рендерим полученный объект задачи напрямую
            if (responseData) {
                renderTodo(responseData);
                todoInput.value = ''; 
                updateCount();
            }
        } catch (err) {
            alert('Не удалось добавить задачу: ' + err.message);
        }
    }
});

// 3. Отображение одной задачи в интерфейсе (DOM)
function renderTodo(todo) {
    const li = document.createElement('li');
    li.setAttribute('data-id', todo.id);
    
    if (todo.is_completed) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <input class="toggle-checkbox" type="checkbox" ${todo.is_completed ? 'checked' : ''}>
        <div class="todo-item-text"></div>
        <button class="destroy">×</button>
    `;

    // НАЖНО: Безопасно добавляем текст задачи (строка была закомментирована)
    li.querySelector('.todo-item-text').textContent = todo.title;

    // Переключение статуса выполнения (Обновление в БД)
    const checkbox = li.querySelector('.toggle-checkbox');
    checkbox.addEventListener('change', async () => {
        try {
            await updateTodoStatusInDB(todo.id, checkbox.checked);
            li.classList.toggle('completed', checkbox.checked);
            updateCount();
        } catch (err) {
            // Если база данных вернула ошибку, возвращаем галочку на место
            checkbox.checked = !checkbox.checked;
            alert('Не удалось обновить статус: ' + err.message);
        }
    });

    // Удаление задачи из БД и интерфейса
    const destroyBtn = li.querySelector('.destroy');
    destroyBtn.addEventListener('click', async () => {
        try {
            await deleteTodoFromDB(todo.id);
            li.remove();
            updateCount();
        } catch (err) {
            alert('Не удалось удалить задачу: ' + err.message);
        }
    });

    todoList.appendChild(li);
}

// 4. Счетчик активных задач 
function updateCount() {
    const activeTodos = todoList.querySelectorAll('li:not(.completed)').length;
    todoCount.textContent = activeTodos;
}

// Запускаем приложение
init();