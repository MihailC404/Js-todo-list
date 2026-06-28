import { getTodosFromDB, addTodoToDB, deleteTodoFromDB, updateTodoStatusInDB } from './services/supabase.js';

const todoInput = document.querySelector('.new-todo');
const todoList = document.querySelector('.todo-list');
const todoCount = document.querySelector('.todo-count strong');
const filterAll = document.querySelector('#filter-all');
const filterActive = document.querySelector('#filter-active');
const filterCompleted = document.querySelector('#filter-completed');
const clearCompletedBtn = document.querySelector('.clear-completed');

//Загрузка  задач c БД
async function init() {
    try {
        const todos = await getTodosFromDB();
        todoList.innerHTML = ''; 
        
        todos.forEach(todo => renderTodo(todo));
        
        if (todoList) {
            todoList.classList.add('limit-3'); 
        }
        
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
                if (filterAll) {
                    resetFilterLinks();
                    filterAll.classList.add('selected');
                    todoList.classList.remove('limit-3'); 
                    todoList.querySelectorAll('li').forEach(li => li.style.display = 'flex');
                }
                if (Array.isArray(responseData)) {
                    renderTodo(responseData[0]);
                } else {
                    renderTodo(responseData);
                }

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
        <div class="custom-checkbox" style="position: absolute; left: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: ${todo.is_completed ? '1px solid #2ecc71' : '1.5px solid #e6e6e6'}; border-radius: 50%; box-sizing: border-box; z-index: 5; transition: all 0.2s ease;">
            <div class="custom-checkmark" style="display: ${todo.is_completed ? 'block' : 'none'}; width: 6px; height: 12px; border: solid #2ecc71; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); margin-bottom: 2px;"></div>
        </div>
        <div class="todo-item-text" style="padding-left: 65px;"></div>
        <button class="destroy">×</button>
    `;
    
    li.querySelector('.todo-item-text').textContent = todo.title;
    const checkbox = li.querySelector('.custom-checkbox');
    checkbox.addEventListener('click', async () => {
        const currentStatus = li.classList.contains('completed');
        const nextStatus = !currentStatus;
        
        try {
            await updateTodoStatusInDB(todo.id, nextStatus);
            li.classList.toggle('completed', nextStatus);
            const checkmark = checkbox.querySelector('.custom-checkmark');
            if (nextStatus) {
                checkbox.style.border = '1px solid #2ecc71';
                checkmark.style.display = 'block';
            } else {
                checkbox.style.border = '1.5px solid #e6e6e6';
                checkmark.style.display = 'none';
            }
            
            updateCount();
        } catch (err) {
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
    if (!todoCount) return;
    const activeTodos = todoList.querySelectorAll('li:not(.completed)').length;
    todoCount.innerHTML = `Осталось задач: <strong>${activeTodos}</strong>`;
    
    const clearCompletedBtn = document.querySelector('.clear-completed');
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