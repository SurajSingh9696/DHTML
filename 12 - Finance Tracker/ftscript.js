class FinanceTracker {
    constructor() {
        this.transactions = this.loadFromLocalStorage();
        this.currentFilter = 'all';
        this.selectedType = 'income';
        this.theme = localStorage.getItem('financeTheme') || 'dark';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setTodayDate();
        this.updateUI();
    }

    setupEventListeners() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectType(btn.dataset.type);
            });
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    selectType(type) {
        this.selectedType = type;
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
    }

    addTransaction() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        if (!description || !amount || !category || !date) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        if (amount <= 0) {
            this.showNotification('Amount must be greater than 0', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            category,
            date,
            type: this.selectedType,
            timestamp: new Date().getTime()
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateUI();
        this.resetForm();
        this.animateBalanceUpdate();
        this.showNotification('Transaction added successfully!', 'success');
    }

    deleteTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.updateUI();
            this.animateBalanceUpdate();
            this.showNotification('Transaction deleted', 'info');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTransactions();
    }

    updateUI() {
        this.updateBalances();
        this.renderTransactions();
    }

    updateBalances() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        this.animateValue('totalIncome', income);
        this.animateValue('totalExpense', expense);
        this.animateValue('totalBalance', balance);
    }

    animateValue(elementId, value) {
        const element = document.getElementById(elementId);
        
        if (element.animationFrame) {
            cancelAnimationFrame(element.animationFrame);
        }
        
        const current = parseFloat(element.textContent.replace(/[$,]/g, '')) || 0;
        const increment = (value - current) / 20;
        let currentValue = current;
        let frame = 0;
        const maxFrames = 20;

        const animate = () => {
            frame++;
            currentValue += increment;
            
            if (frame >= maxFrames || Math.abs(value - currentValue) < 0.01) {
                element.textContent = this.formatCurrency(value);
                element.animationFrame = null;
                return;
            }
            
            element.textContent = this.formatCurrency(currentValue);
            element.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    }

    animateBalanceUpdate() {
        const balanceCards = document.querySelectorAll('.balance-card');
        balanceCards.forEach(card => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        const emptyState = document.getElementById('emptyState');

        let filtered = [...this.transactions];

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(t => t.type === this.currentFilter);
        }

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filtered.length === 0) {
            transactionsList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        transactionsList.classList.remove('hidden');
        emptyState.classList.add('hidden');

        transactionsList.innerHTML = filtered.map(transaction => `
            <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
                <div class="transaction-icon">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-details">
                    <div class="transaction-description">${this.escapeHtml(transaction.description)}</div>
                    <div class="transaction-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(transaction.date)}</span>
                        <span><i class="fas fa-tag"></i> ${this.getCategoryName(transaction.category)}</span>
                    </div>
                </div>
                <div class="transaction-amount">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" onclick="tracker.deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    getCategoryIcon(category) {
        const icons = {
            salary: '<i class="fas fa-money-bill-wave"></i>',
            freelance: '<i class="fas fa-briefcase"></i>',
            investment: '<i class="fas fa-chart-line"></i>',
            gift: '<i class="fas fa-gift"></i>',
            food: '<i class="fas fa-utensils"></i>',
            transport: '<i class="fas fa-car"></i>',
            shopping: '<i class="fas fa-shopping-bag"></i>',
            bills: '<i class="fas fa-file-invoice-dollar"></i>',
            entertainment: '<i class="fas fa-film"></i>',
            health: '<i class="fas fa-heartbeat"></i>',
            education: '<i class="fas fa-graduation-cap"></i>',
            other: '<i class="fas fa-box"></i>'
        };
        return icons[category] || icons.other;
    }

    getCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatCurrency(amount) {
        return '$' + Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    resetForm() {
        document.getElementById('transactionForm').reset();
        this.setTodayDate();
        this.selectType('income');
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
                    z-index: 1000;
                    animation: slideInRight 0.4s ease, fadeOut 0.4s ease 2.6s forwards;
                }
                .notification-success { border-color: var(--success-color); }
                .notification-success i { color: var(--success-color); }
                .notification-error { border-color: var(--danger-color); }
                .notification-error i { color: var(--danger-color); }
                .notification-info { border-color: var(--primary-color); }
                .notification-info i { color: var(--primary-color); }
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
        localStorage.setItem('financeTransactions', JSON.stringify(this.transactions));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('financeTransactions');
        return data ? JSON.parse(data) : [];
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
        localStorage.setItem('financeTheme', this.theme);
        
        document.body.classList.toggle('light-theme');
        
        const themeIcon = document.getElementById('themeToggle');
        if (this.theme === 'light') {
            themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        this.showNotification(`Switched to ${this.theme} mode`, 'info');
    }
}

const tracker = new FinanceTracker();

if (tracker.transactions.length === 0) {
    console.log('Finance Tracker initialized. Add your first transaction!');
}
