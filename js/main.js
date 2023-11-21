// Знаходимо елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функції
function addTask(event) {
	// Відміняємо відправку форми
	event.preventDefault();

	// Дістаємо текст задачі із поля вводу
	const taskText = taskInput.value;

	// Описуємо задачу у вигляді об'єкту
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// Додаємо задачу в масив із задачами
	tasks.push(newTask);

	// Зберігаємо список задач в браузері localStorage
	saveToLocalStorage();

	// Рендеримо задачу на сторінці
	renderTask(newTask);

	// Чистимо поле для вводу повертаємо на нього фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	// Перевіряємо чи клік був НЕ на кнопці  "видалить задачу"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Визначаємо ID задачі
	const id = Number(parenNode.id);

	// Видаляємо задачі через фільтрацію масива
	tasks = tasks.filter((task) => task.id !== id);

	// Зберігаємо список задач в браузері localStorage
	saveToLocalStorage();

	// Видаляємо задачу з розмітки
	parenNode.remove();

	checkEmptyList();
}

function doneTask(event) {
	// Перевіряємо що клік  був не на кнопці  "задача виконана"
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	// Визначаємо ID задачі
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	// Зберігаємо список задач в браузері localStorage
	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Task list is empty</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формуємо  CSS класс
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Формуєм розмітку для нової задачі
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Додаємо задачу на сторінку
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
