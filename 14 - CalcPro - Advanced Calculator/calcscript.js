class CalcPro {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.memory = 0;
        this.history = this.loadHistory();
        this.mode = 'basic';
        this.theme = localStorage.getItem('calcproTheme') || 'dark';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateMemoryDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('memoryClear').addEventListener('click', () => {
            this.memoryClear();
        });

        document.getElementById('memoryRecall').addEventListener('click', () => {
            this.memoryRecall();
        });

        document.getElementById('memoryAdd').addEventListener('click', () => {
            this.memoryAdd();
        });

        document.getElementById('memorySubtract').addEventListener('click', () => {
            this.memorySubtract();
        });

        document.getElementById('historyToggle').addEventListener('click', () => {
            this.toggleHistory();
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButtonClick(e) {
        const btn = e.currentTarget;
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (value !== undefined) {
            if (value === '.' && this.currentValue.includes('.')) {
                return;
            }
            this.inputDigit(value);
        } else if (action) {
            this.handleAction(action);
        }

        this.updateDisplay();
    }

    handleAction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'percent':
                this.percent();
                break;
            case 'negate':
                this.negate();
                break;
            case 'equals':
                this.equals();
                break;
            case 'sin':
                this.scientificOperation('sin');
                break;
            case 'cos':
                this.scientificOperation('cos');
                break;
            case 'tan':
                this.scientificOperation('tan');
                break;
            case 'sqrt':
                this.scientificOperation('sqrt');
                break;
            case 'power':
                this.scientificOperation('power');
                break;
            case 'log':
                this.scientificOperation('log');
                break;
            case 'ln':
                this.scientificOperation('ln');
                break;
            case 'pi':
                this.inputConstant(Math.PI);
                break;
            case 'e':
                this.inputConstant(Math.E);
                break;
        }
    }

    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentValue = String(digit);
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? String(digit) : this.currentValue + digit;
        }
    }

    inputConstant(value) {
        this.currentValue = String(value);
        this.waitingForOperand = true;
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    negate() {
        this.currentValue = String(parseFloat(this.currentValue) * -1);
    }

    percent() {
        this.currentValue = String(parseFloat(this.currentValue) / 100);
    }

    performOperation(nextOperator) {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === '') {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.previousValue, inputValue, this.operator);
            this.currentValue = String(result);
            this.previousValue = result;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    calculate(firstValue, secondValue, operator) {
        switch(operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return secondValue !== 0 ? firstValue / secondValue : 'Error';
            case '^':
                return Math.pow(firstValue, secondValue);
            default:
                return secondValue;
        }
    }

    equals() {
        const inputValue = parseFloat(this.currentValue);

        if (this.operator && this.previousValue !== '') {
            const expression = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${inputValue}`;
            const result = this.calculate(this.previousValue, inputValue, this.operator);
            
            if (result !== 'Error') {
                this.addToHistory(expression, result);
                this.currentValue = String(result);
                this.previousValue = '';
                this.operator = null;
                this.waitingForOperand = true;
            } else {
                this.showNotification('Division by zero!', 'error');
                this.clear();
            }
        }
    }

    scientificOperation(operation) {
        const value = parseFloat(this.currentValue);
        let result;
        let expression;

        switch(operation) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                expression = `sin(${value}°)`;
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                expression = `cos(${value}°)`;
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                expression = `tan(${value}°)`;
                break;
            case 'sqrt':
                if (value < 0) {
                    this.showNotification('Cannot calculate square root of negative number!', 'error');
                    return;
                }
                result = Math.sqrt(value);
                expression = `√${value}`;
                break;
            case 'power':
                result = Math.pow(value, 2);
                expression = `${value}²`;
                break;
            case 'log':
                if (value <= 0) {
                    this.showNotification('Invalid input for logarithm!', 'error');
                    return;
                }
                result = Math.log10(value);
                expression = `log(${value})`;
                break;
            case 'ln':
                if (value <= 0) {
                    this.showNotification('Invalid input for natural logarithm!', 'error');
                    return;
                }
                result = Math.log(value);
                expression = `ln(${value})`;
                break;
        }

        this.addToHistory(expression, result);
        this.currentValue = String(result);
        this.waitingForOperand = true;
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryDisplay();
        this.showNotification('Memory cleared', 'info');
    }

    memoryRecall() {
        this.currentValue = String(this.memory);
        this.waitingForOperand = true;
        this.updateDisplay();
        this.showNotification('Memory recalled', 'info');
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.updateMemoryDisplay();
        this.showNotification('Added to memory', 'success');
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.updateMemoryDisplay();
        this.showNotification('Subtracted from memory', 'success');
    }

    updateMemoryDisplay() {
        document.getElementById('memoryValue').textContent = this.formatNumber(this.memory);
    }

    switchMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        document.querySelectorAll('.buttons-grid').forEach(grid => {
            grid.classList.add('hidden');
        });

        document.querySelector(`.${mode}-mode`).classList.remove('hidden');
        this.showNotification(`Switched to ${mode} mode`, 'info');
    }

    updateDisplay() {
        const mainDisplay = document.getElementById('mainDisplay');
        const historyDisplay = document.getElementById('historyDisplay');

        mainDisplay.textContent = this.formatNumber(parseFloat(this.currentValue));

        if (this.operator && this.previousValue !== '') {
            historyDisplay.textContent = `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol(this.operator)}`;
        } else {
            historyDisplay.textContent = '';
        }
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[operator] || operator;
    }

    formatNumber(num) {
        if (isNaN(num)) return '0';
        
        const str = String(num);
        if (str.length > 12) {
            if (str.includes('e')) {
                return num.toExponential(6);
            }
            return num.toPrecision(10);
        }
        
        return str;
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result: this.formatNumber(result),
            timestamp: Date.now()
        };

        this.history.unshift(historyItem);
        
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-inbox"></i>
                    <p>No history yet</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="calcpro.loadFromHistory('${item.result}')">
                <div class="history-expression">${this.escapeHtml(item.expression)}</div>
                <div class="history-result">= ${this.escapeHtml(item.result)}</div>
            </div>
        `).join('');
    }

    loadFromHistory(result) {
        this.currentValue = result;
        this.waitingForOperand = true;
        this.updateDisplay();
        this.showNotification('Loaded from history', 'info');
    }

    clearHistory() {
        if (this.history.length === 0) {
            this.showNotification('No history to clear', 'info');
            return;
        }

        if (confirm('Clear all calculation history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showNotification('History cleared', 'success');
        }
    }

    toggleHistory() {
        const panel = document.getElementById('historyPanel');
        panel.classList.toggle('active');
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            e.preventDefault();
            this.inputDigit(e.key);
            this.updateDisplay();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            e.preventDefault();
            this.performOperation(e.key);
            this.updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.equals();
            this.updateDisplay();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.clear();
            this.updateDisplay();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.delete();
            this.updateDisplay();
        }
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
        localStorage.setItem('calcproTheme', this.theme);

        document.body.classList.toggle('light-theme');

        const themeIcon = document.getElementById('themeToggle');
        if (this.theme === 'light') {
            themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }

        this.showNotification(`Switched to ${this.theme} mode`, 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 14px 22px;
                    border-radius: 12px;
                    background: var(--card-bg);
                    border: 2px solid;
                    color: var(--text-primary);
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: var(--shadow);
                    z-index: 2000;
                    animation: slideDown 0.3s ease, fadeOutUp 0.3s ease 2.2s forwards;
                }
                .notification-success { border-color: var(--success-color); }
                .notification-success i { color: var(--success-color); }
                .notification-error { border-color: var(--danger-color); }
                .notification-error i { color: var(--danger-color); }
                .notification-info { border-color: var(--info-color); }
                .notification-info i { color: var(--info-color); }
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes fadeOutUp {
                    to { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2500);
    }

    saveHistory() {
        localStorage.setItem('calcproHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const data = localStorage.getItem('calcproHistory');
        return data ? JSON.parse(data) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.calcpro = new CalcPro();
    
    document.querySelectorAll('.operator-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const operator = btn.dataset.value;
            calcpro.performOperation(operator);
            calcpro.updateDisplay();
        });
    });
});
