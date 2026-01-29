class TaskFlow {
    constructor() {
        this.tasks = this.loadFromLocalStorage();
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.searchQuery = '';
        this.editingTaskId = null;
        this.theme = localStorage.getItem('taskflowTheme') || 'dark';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setTodayDate();
        this.updateUI();
    }

    setupEventListeners() {
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderTasks();
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('deleteAll').addEventListener('click', () => {
            this.deleteAll();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').value = today;
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const category = document.getElementById('taskCategory').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title || !category || !priority || !dueDate) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            category,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveToLocalStorage();
        this.updateUI();
        this.resetForm();
        this.showNotification('Task added successfully!', 'success');
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.updateUI();
            this.showNotification(
                task.completed ? 'Task completed! 🎉' : 'Task marked as active',
                task.completed ? 'success' : 'info'
            );
        }
    }

    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && confirm(`Delete task: "${task.title}"?`)) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.updateUI();
            this.showNotification('Task deleted', 'info');
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.editingTaskId = id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = task.dueDate;
        document.getElementById('editModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('active');
        this.editingTaskId = null;
    }

    saveEdit() {
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (!task) return;

        task.title = document.getElementById('editTaskTitle').value.trim();
        task.category = document.getElementById('editTaskCategory').value;
        task.priority = document.getElementById('editTaskPriority').value;
        task.dueDate = document.getElementById('editTaskDueDate').value;

        this.saveToLocalStorage();
        this.updateUI();
        this.closeModal();
        this.showNotification('Task updated successfully!', 'success');
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.updateUI();
            this.showNotification('Completed tasks cleared', 'success');
        }
    }

    deleteAll() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to delete', 'info');
            return;
        }

        if (confirm(`Delete all ${this.tasks.length} task(s)? This cannot be undone!`)) {
            this.tasks = [];
            this.saveToLocalStorage();
            this.updateUI();
            this.showNotification('All tasks deleted', 'info');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    updateUI() {
        this.updateStats();
        this.renderTasks();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('progressPercent').textContent = `${progress}%`;
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');

        let filtered = [...this.tasks];

        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        if (this.searchQuery) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(this.searchQuery) ||
                t.category.toLowerCase().includes(this.searchQuery)
            );
        }

        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'date-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        if (filtered.length === 0) {
            tasksList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        tasksList.classList.remove('hidden');
        emptyState.classList.add('hidden');

        tasksList.innerHTML = filtered.map(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const isOverdue = dueDate < today && !task.completed;
            const dueDateFormatted = this.formatDate(task.dueDate);

            return `
                <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="taskflow.toggleTaskComplete(${task.id})"></div>
                    <div class="task-content">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-meta">
                            <span><i class="fas fa-tag"></i> ${this.getCategoryName(task.category)}</span>
                            <span class="${isOverdue ? 'overdue-date' : ''}">
                                <i class="fas fa-calendar"></i> ${dueDateFormatted}
                                ${isOverdue ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                            </span>
                            <span class="task-badge badge-${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" onclick="taskflow.openEditModal(${task.id})" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="taskflow.deleteTask(${task.id})" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const style = document.createElement('style');
        style.textContent = `
            .overdue-date { color: var(--danger-color) !important; font-weight: 600; }
        `;
        if (!document.querySelector('#overdue-style')) {
            style.id = 'overdue-style';
            document.head.appendChild(style);
        }
    }

    getCategoryName(category) {
        const categories = {
            work: '💼 Work',
            personal: '👤 Personal',
            shopping: '🛒 Shopping',
            health: '🏃 Health',
            learning: '📚 Learning',
            finance: '💰 Finance',
            home: '🏠 Home',
            other: '📌 Other'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        this.setTodayDate();
    }

    loadTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('light-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('taskflowTheme', this.theme);

        document.body.classList.toggle('light-theme');

        const themeIcon = document.getElementById('themeToggle');
        if (this.theme === 'light') {
            themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }

        this.showNotification(`Switched to ${this.theme} mode`, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    background: var(--card-bg);
                    border: 2px solid;
                    color: var(--text-primary);
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: var(--shadow);
                    z-index: 3000;
                    animation: slideInRight 0.4s ease, fadeOut 0.4s ease 2.6s forwards;
                }
                .notification-success { border-color: var(--success-color); }
                .notification-success i { color: var(--success-color); }
                .notification-error { border-color: var(--danger-color); }
                .notification-error i { color: var(--danger-color); }
                .notification-info { border-color: var(--info-color); }
                .notification-info i { color: var(--info-color); }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(100px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('taskflowTasks', JSON.stringify(this.tasks));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('taskflowTasks');
        return data ? JSON.parse(data) : [];
    }
}

const taskflow = new TaskFlow();
