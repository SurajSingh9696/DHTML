const addBtn = document.querySelector('#add-btn');
const modal = document.querySelector('#add-modal');
const cancelBtn = document.querySelector('#cancel-btn');
const saveBtn = document.querySelector('#save-btn');
const taskInput = document.querySelector('#task-input');
const tasksList = document.querySelector('#tasks-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const renderTasks = () => {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><p>No tasks yet!</p><p>Click "Add Task" to get started.</p></div>';
        return;
    }

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        taskItem.innerHTML = `
            <div class="task-text">${task}</div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
    });
};

const addTask = () => {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    tasks.push(taskText);
    saveTasks();
    renderTasks();
    closeModal();
    taskInput.value = '';
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const openModal = () => {
    modal.classList.add('active');
    taskInput.focus();
};

const closeModal = () => {
    modal.classList.remove('active');
    taskInput.value = '';
};

addBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
saveBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

window.deleteTask = deleteTask;

renderTasks();