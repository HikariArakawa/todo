'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'simple-todo-app-items';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to load todos', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;

  function addTodo(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;

    setTodos((prev) => [
      { id: crypto.randomUUID(), text: value, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setText('');
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Simple & Fast</p>
        <h1>TODO アプリ</h1>
        <p className="lead">やることを追加して、完了済みもすぐ見えるようにしましょう。</p>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="例: 朝の会議資料を確認する"
            autoComplete="off"
            required
          />
          <button type="submit">追加</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="フィルター">
            {['all', 'active', 'completed'].map((option) => (
              <button
                key={option}
                type="button"
                className={`filter ${filter === option ? 'active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option === 'all' ? 'すべて' : option === 'active' ? '未完了' : '完了済み'}
              </button>
            ))}
          </div>
          <button type="button" className="ghost-button" onClick={clearCompleted}>
            完了済みを削除
          </button>
        </div>

        <ul className="todo-list" aria-live="polite">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">表示するタスクがありません。</li>
          ) : (
            filteredTodos.map((todo) => {
              const urgent = todo.text.includes('社長');
              return (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    aria-label="完了状態を切り替える"
                  />
                  <span className={`todo-label ${urgent ? 'urgent' : ''}`}>{todo.text}</span>
                  <button type="button" onClick={() => deleteTodo(todo.id)} aria-label="削除">
                    削除
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <footer className="footer">
          <span>{activeCount}件の未完了タスク / {todos.length}件中</span>
          <span>ローカルストレージに保存されます</span>
        </footer>
      </section>
    </main>
  );
}
