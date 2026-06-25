import { getTodosFromDB, addTodoToDB, deleteTodoFromDB, updateTodoStatusInDB } from './services/supabase.js';

const todoInput = document.querySelector('.new-todo');
const todoList = document.querySelector('.todo-list');
const todoCount = document.querySelector('.todo-count strong');
const filterAll = document.querySelector('#filter-all');
const filterActive = document.querySelector('#filter-active');
const filterCompleted = document.querySelector('#filter-completed');
const clearCompletedBtn = document.querySelector('.clear-completed');

//  Загрузка всех задач c БД
async function init() {
    try {
        const todos = await getTodosFromDB();
        todoList.innerHTML = ''; // Очищаем список перед рендером
        
        todos.forEach(todo => renderTodo(todo));
        updateCount();
    } catch (err) {
        console.error('Не удалось загрузить задачи:', err);
        alert('Ошибка при загрузке данных из базы: ' + err.message);
    }
}

todoInput.addEventListener('keydown', async (e) => {
    const text = todoInput.value.trim();
    
    if (e.key === 'Enter' && text !== '') {
        try {
            const responseData = await addTodoToDB(text);
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
    li.querySelector('.todo-item-text').textContent = todo.title;
    const checkbox = li.querySelector('.toggle-checkbox');
    checkbox.addEventListener('change', async () => {
        try {
            await updateTodoStatusInDB(todo.id, checkbox.checked);
            li.classList.toggle('completed', checkbox.checked);
            updateCount();
        } catch (err) {
            checkbox.checked = !checkbox.checked;
            alert('Не удалось обновить статус: ' + err.message);
        }
    });

    // Удаление задач
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

function resetFilterLinks() {
    document.querySelectorAll('.filters a').forEach(a => a.classList.remove('selected'));
}




// кнопка Active 
if (filterActive) {
    filterActive.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilterLinks();
        filterActive.classList.add('selected');
        todoList.classList.add('limit-3'); 
        
        todoList.querySelectorAll('li').forEach(li => {
            if (li.classList.contains('completed')) {
                li.style.display = 'none';
            } else {
                li.style.display = 'flex';
            }
        });
    });
}

//кнопка All 
if (filterAll) {
    filterAll.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilterLinks();
        filterAll.classList.add('selected');
        todoList.classList.remove('limit-3'); 
        todoList.querySelectorAll('li').forEach(li => li.style.display = 'flex');
    });
}

if (filterCompleted) {
    filterCompleted.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilterLinks();
        filterCompleted.classList.add('selected');
        todoList.classList.add('limit-3');
        
        todoList.querySelectorAll('li').forEach(li => {
            if (!li.classList.contains('completed')) {
                li.style.display = 'none';
            } else {
                li.style.display = 'flex';
            }
         });
    });
}

// счётчик задач
function updateCount() {
    const activeTodos = todoList.querySelectorAll('li:not(.completed)').length;
    todoCount.innerHTML = `<strong>${activeTodos}</strong> items left`;
    if (!clearCompletedBtn) return;
    
    const completedTodos = todoList.querySelectorAll('li.completed').length;
    
    if (completedTodos > 0) {
        clearCompletedBtn.style.display = 'block';
        clearCompletedBtn.textContent = `Clear completed [${completedTodos}]`;
    } else {
        clearCompletedBtn.style.display = 'none';
    }
}

init();