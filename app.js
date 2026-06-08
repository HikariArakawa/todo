const STORAGE_KEY = 'simple-todo-app-items';
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedButton = document.getElementById('clear-completed');
const filters = document.querySelectorAll('.filter');

let todos = loadTodos();
let currentFilter = 'all';

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load todos:', error);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">表示するタスクがありません。</li>';
  } else {
    todoList.innerHTML = filteredTodos
      .map((todo) => {
        const isImportant = todo.text.includes('社長');
        return `
          <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input type="checkbox" data-action="toggle" ${todo.completed ? 'checked' : ''} aria-label="完了状態を切り替える" />
            <span class="todo-label ${isImportant ? 'urgent' : ''}">${escapeHtml(todo.text)}</span>
            <button type="button" data-action="delete" aria-label="削除">削除</button>
          </li>
        `;
      })
      .join('');
  }

  const activeCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `${activeCount}件の未完了タスク / ${todos.length}件中`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.unshift({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle('active', item === button));
    renderTodos();
  });
});

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

clearCompletedButton.addEventListener('click', clearCompleted);

todoList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="delete"]');
  if (button) {
    const item = button.closest('.todo-item');
    deleteTodo(item.dataset.id);
    return;
  }
});

todoList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[data-action="toggle"]');
  if (checkbox) {
    const item = checkbox.closest('.todo-item');
    toggleTodo(item.dataset.id);
  }
});

renderTodos();
