// Selecting elements from the HTML
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const sortSelect = document.getElementById('sort-select');
const filterSelect = document.getElementById('filter-select');
const dateTimeDiv = document.getElementById('date-time');

let tasks = [];

// Function to update the date and time
function updateDateTime() {
  const now = moment();
  const formattedDateTime = `${now.format('MMMM D, YYYY')} - ${now.format('h:mm:ss A')}`;
  dateTimeDiv.textContent = formattedDateTime;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = filterTasks();
  const sortedTasks = sortTasks(filteredTasks);
  sortedTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `${task.text} (Due: ${task.dueDate}) - Priority: ${task.priority}`;
    li.classList.add(`priority-${task.priority}`);
    if (task.completed) {
      li.classList.add('completed', 'fade-out');
      setTimeout(() => {
        li.remove();
      }, 1000); // Remove the completed task after 1 second (1000 milliseconds)
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      renderTasks();
    });
    li.prepend(checkbox);
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      editTask(index);
    });
    li.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(index);
    });
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  if (taskInput.value.trim() !== '') {
    const dueDate = dueDateInput.value ? moment(dueDateInput.value).format('MMMM D, YYYY') : '';
    const priority = prioritySelect.value;
    tasks.push({ text: taskInput.value.trim(), completed: false, dueDate, priority });
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    renderTasks();
  }
}

function editTask(index) {
  const task = tasks[index];
  taskInput.value = task.text;
  dueDateInput.value = moment(task.dueDate, 'MMMM D, YYYY').format('YYYY-MM-DD');
  prioritySelect.value = task.priority;
  tasks.splice(index, 1);
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function filterTasks() {
  const filterValue = filterSelect.value;
  if (filterValue === 'all') {
    return tasks;
  } else if (filterValue === 'completed') {
    return tasks.filter(task => task.completed);
  } else {
    return tasks.filter(task => !task.completed);
  }
}

function sortTasks(tasks) {
  const sortValue = sortSelect.value;
  if (sortValue === 'date-asc') {
    return tasks.sort((a, b) => {
      const dateA = moment(a.dueDate, 'MMMM D, YYYY');
      const dateB = moment(b.dueDate, 'MMMM D, YYYY');
      return dateA.isAfter(dateB) ? 1 : -1;
    });
  } else if (sortValue === 'date-desc') {
    return tasks.sort((a, b) => {
      const dateA = moment(a.dueDate, 'MMMM D, YYYY');
      const dateB = moment(b.dueDate, 'MMMM D, YYYY');
      return dateA.isBefore(dateB) ? 1 : -1;
    });
  } else if (sortValue === 'priority-asc') {
    return tasks.sort((a, b) => {
      const priorityA = ['low', 'medium', 'high'].indexOf(a.priority);
      const priorityB = ['low', 'medium', 'high'].indexOf(b.priority);
      return priorityA - priorityB;
    });
  } else {
    return tasks.sort((a, b) => {
      const priorityA = ['low', 'medium', 'high'].indexOf(a.priority);
      const priorityB = ['low', 'medium', 'high'].indexOf(b.priority);
      return priorityB - priorityA;
    });
  }
}

addTaskBtn.addEventListener('click', addTask);
sortSelect.addEventListener('change', renderTasks);
filterSelect.addEventListener('change', renderTasks);

renderTasks();

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Initial rendering of the date and time0
updateDateTime();