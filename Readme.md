# JS Todo List 📝

## Короткое описание проекта
**JS Todo List** — это современное веб-приложение для удобного планирования и управления повседневными задачами. Проект реализован как Single Page Application (SPA), обеспечивая мгновенный отклик интерфейса без перезагрузки страниц. Благодаря интеграции с облачным бэкендом, приложение поддерживает безопасную синхронизацию списка задач в реальном времени с любого устройства.

## Стек технологий
* **Frontend:** Vanilla JS (ESNext), HTML5, CSS3
* **Backend:** Supabase Auth & Realtime (Serverless Architecture)
* **Database:** PostgreSQL (Supabase)
* **Bundler & Tools:** Vite, ESLint
* **Deployment:** Vercel

## Как запустить локально (кратко)

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/MihailC404/Js-todo-list.git
   cd js-todo-list/Js-todo-list
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` в корне папки проекта и добавьте свои ключи Supabase:
   ```text
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Запустите локальный сервер для разработки:
   ```bash
   npm run dev
   ```

## Ссылка на деплой
👉 [Посмотреть работающее приложение на Vercel](https://js-todo-list-iota.vercel.app)

## Бейдж Code Climate 
[![Maintainability](https://qlty.sh/gh/MihailC404/projects/Js-todo-list/maintainability.svg)](https://qlty.sh/gh/MihailC404/projects/Js-todo-list)