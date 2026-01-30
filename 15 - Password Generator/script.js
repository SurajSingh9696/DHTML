const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthInput = document.getElementById('lengthInput');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function getCharacterPool() {
    let pool = '';
    
    if (includeUppercase.checked) {
        pool += CHARACTER_SETS.uppercase;
    }
    if (includeLowercase.checked) {
        pool += CHARACTER_SETS.lowercase;
    }
    if (includeNumbers.checked) {
        pool += CHARACTER_SETS.numbers;
    }
    if (includeSymbols.checked) {
        pool += CHARACTER_SETS.symbols;
    }
    
    return pool;
}

function validateSettings() {
    const hasAtLeastOneOption = includeUppercase.checked || 
                                includeLowercase.checked || 
                                includeNumbers.checked || 
                                includeSymbols.checked;
    
    if (!hasAtLeastOneOption) {
        showError('Please select at least one character type');
        generateBtn.disabled = true;
        return false;
    }
    
    const length = parseInt(lengthInput.value, 10);
    if (isNaN(length) || length < 4 || length > 64) {
        showError('Password length must be between 4 and 64');
        generateBtn.disabled = true;
        return false;
    }
    
    generateBtn.disabled = false;
    return true;
}

function generateSecurePassword(length, characterPool) {
    if (!characterPool || characterPool.length === 0) {
        throw new Error('Character pool is empty');
    }
    
    if (length < 1) {
        throw new Error('Length must be at least 1');
    }
    
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = array[i] % characterPool.length;
        password += characterPool[randomIndex];
    }
    
    return password;
}

function ensureCharacterTypes(password, length) {
    const requiredChars = [];
    const selectedSets = [];
    
    if (includeUppercase.checked) {
        selectedSets.push({
            set: CHARACTER_SETS.uppercase,
            regex: /[A-Z]/
        });
    }
    if (includeLowercase.checked) {
        selectedSets.push({
            set: CHARACTER_SETS.lowercase,
            regex: /[a-z]/
        });
    }
    if (includeNumbers.checked) {
        selectedSets.push({
            set: CHARACTER_SETS.numbers,
            regex: /[0-9]/
        });
    }
    if (includeSymbols.checked) {
        selectedSets.push({
            set: CHARACTER_SETS.symbols,
            regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/
        });
    }
    
    if (selectedSets.length > length) {
        return password;
    }
    
    const missingTypes = selectedSets.filter(type => !type.regex.test(password));
    
    if (missingTypes.length === 0) {
        return password;
    }
    
    const passwordArray = password.split('');
    const array = new Uint32Array(missingTypes.length);
    window.crypto.getRandomValues(array);
    
    missingTypes.forEach((type, index) => {
        const randomChar = type.set[array[index] % type.set.length];
        const randomPosition = Math.floor((array[index] / 0xFFFFFFFF) * passwordArray.length);
        passwordArray[randomPosition] = randomChar;
    });
    
    return passwordArray.join('');
}

function calculateStrength(password) {
    if (!password) {
        return { score: 0, text: 'No Password' };
    }
    
    let score = 0;
    const length = password.length;
    
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;
    
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    const uniqueChars = new Set(password).size;
    const uniquenessRatio = uniqueChars / length;
    if (uniquenessRatio > 0.7) score += 1;
    
    if (score <= 3) {
        return { score: 1, text: 'Weak Password' };
    } else if (score <= 6) {
        return { score: 2, text: 'Medium Password' };
    } else {
        return { score: 3, text: 'Strong Password' };
    }
}

function updateStrengthIndicator(password) {
    const strength = calculateStrength(password);
    
    strengthBar.className = 'strength-fill';
    
    if (strength.score === 1) {
        strengthBar.classList.add('weak');
    } else if (strength.score === 2) {
        strengthBar.classList.add('medium');
    } else if (strength.score === 3) {
        strengthBar.classList.add('strong');
    }
    
    strengthText.textContent = strength.text;
}

function showError(message) {
    passwordOutput.value = '';
    strengthBar.className = 'strength-fill';
    strengthText.textContent = message;
    strengthText.style.color = '#ef4444';
    
    setTimeout(() => {
        strengthText.style.color = '#666';
        if (!passwordOutput.value) {
            strengthText.textContent = 'Password Strength';
        }
    }, 3000);
}

function generatePassword() {
    try {
        if (!validateSettings()) {
            return;
        }
        
        const length = parseInt(lengthInput.value, 10);
        const characterPool = getCharacterPool();
        
        if (characterPool.length === 0) {
            throw new Error('No character types selected');
        }
        
        let password = generateSecurePassword(length, characterPool);
        password = ensureCharacterTypes(password, length);
        
        passwordOutput.value = password;
        updateStrengthIndicator(password);
        
    } catch (error) {
        showError('Error generating password');
        console.error('Password generation error:', error);
    }
}

function copyToClipboard() {
    const password = passwordOutput.value;
    
    if (!password) {
        showError('No password to copy');
        return;
    }
    
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(password);
        return;
    }
    
    navigator.clipboard.writeText(password)
        .then(() => {
            showCopySuccess();
        })
        .catch(err => {
            console.error('Clipboard API failed:', err);
            fallbackCopyToClipboard(password);
        });
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    
    try {
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showError('Failed to copy password');
        }
    } catch (err) {
        showError('Failed to copy password');
        console.error('Fallback copy failed:', err);
    } finally {
        document.body.removeChild(textArea);
    }
}

function showCopySuccess() {
    copyBtn.classList.add('copied');
    const originalText = strengthText.textContent;
    strengthText.textContent = 'Password copied!';
    strengthText.style.color = '#10b981';
    
    setTimeout(() => {
        copyBtn.classList.remove('copied');
        strengthText.textContent = originalText;
        strengthText.style.color = '#666';
    }, 2000);
}

function updateLengthDisplay() {
    const value = lengthInput.value;
    lengthValue.textContent = value;
    lengthValue.style.transform = 'scale(1.2)';
    setTimeout(() => {
        lengthValue.style.transform = 'scale(1)';
    }, 200);
}

function initializeEventListeners() {
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);
    
    lengthInput.addEventListener('input', updateLengthDisplay);
    
    [includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
        checkbox.addEventListener('change', validateSettings);
    });
    
    passwordOutput.addEventListener('focus', function() {
        this.select();
    });
}

function initialize() {
    try {
        if (!window.crypto || !window.crypto.getRandomValues) {
            showError('Secure random generation not supported');
            generateBtn.disabled = true;
            return;
        }
        
        initializeEventListeners();
        validateSettings();
        generatePassword();
        
    } catch (error) {
        showError('Initialization failed');
        console.error('Initialization error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
