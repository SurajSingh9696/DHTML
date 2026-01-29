const categoryUnits = {
    length: {
        "Millimeter": 0.001,
        "Centimeter": 0.01,
        "Meter": 1,
        "Kilometer": 1000,
        "Inch": 0.0254,
        "Foot": 0.3048,
        "Yard": 0.9144,
        "Mile": 1609.34
    },
    area: {
        "Square Millimeter": 0.000001,
        "Square Centimeter": 0.0001,
        "Square Meter": 1,
        "Square Kilometer": 1000000,
        "Square Inch": 0.00064516,
        "Square Foot": 0.092903,
        "Square Yard": 0.836127,
        "Square Mile": 2589988,
        "Hectare": 10000,
        "Acre": 4046.86
    },
    volume: {
        "Milliliter": 0.000001,
        "Liter": 0.001,
        "Cubic Meter": 1,
        "Cubic Centimeter": 0.000001,
        "Gallon (US)": 0.00378541,
        "Pint (US)": 0.000473176,
        "Quart (US)": 0.000946353,
        "Cup (US)": 0.000236588
    },
    mass: {
        "Milligram": 0.000001,
        "Gram": 0.001,
        "Kilogram": 1,
        "Ounce": 0.0283495,
        "Pound": 0.453592,
        "Ton": 1000
    },
    data: {
        "Byte": 1,
        "Kilobyte": 1024,
        "Megabyte": 1048576,
        "Gigabyte": 1073741824,
        "Terabyte": 1099511627776,
        "Petabyte": 1125899906842624
    },
    speed: {
        "Meters Per Second": 1,
        "Kilometers Per Hour": 0.277778,
        "Miles Per Hour": 0.44704,
        "Knot": 0.51444
    },
    time: {
        "Millisecond": 0.001,
        "Second": 1,
        "Minute": 60,
        "Hour": 3600,
        "Day": 86400,
        "Week": 604800,
        "Month": 2592000,
        "Year": 31536000
    },
    temperature: {
        "Celsius": "C",
        "Fahrenheit": "F",
        "Kelvin": "K"
    }
};

const tempConversions = {
    'C-F': (c) => (c * 9/5) + 32,
    'C-K': (c) => c + 273.15,
    'F-C': (f) => (f - 32) * 5/9,
    'F-K': (f) => ((f - 32) * 5/9) + 273.15,
    'K-C': (k) => k - 273.15,
    'K-F': (k) => ((k - 273.15) * 9/5) + 32
};

let currentCategory = 'length';

const categoryBtns = document.querySelectorAll('.category-btn');
const fromUnit = document.querySelector('#from-unit');
const toUnit = document.querySelector('#to-unit');
const fromValue = document.querySelector('#from-value');
const toValue = document.querySelector('#to-value');
const convertBtn = document.querySelector('.convert-btn');
const resetBtn = document.querySelector('.reset-btn');
const swapBtn = document.querySelector('.swap-btn');

const populateUnits = (category) => {
    const units = categoryUnits[category];
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    Object.keys(units).forEach((unit, index) => {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = unit;
        
        const option2 = document.createElement('option');
        option2.value = unit;
        option2.textContent = unit;
        
        fromUnit.appendChild(option1);
        toUnit.appendChild(option2);
        
        if (index === 1) {
            option2.selected = true;
        }
    });

    toValue.value = '';
};

const performConversion = () => {
    const fromVal = parseFloat(fromValue.value);
    
    if (isNaN(fromVal) || fromVal === '') {
        toValue.value = '';
        return;
    }

    if (currentCategory === 'temperature') {
        const from = fromUnit.value;
        const to = toUnit.value;
        
        if (from === to) {
            toValue.value = fromVal.toFixed(2);
        } else {
            const key = `${from[0]}-${to[0]}`;
            const result = tempConversions[key](fromVal);
            toValue.value = result.toFixed(2);
        }
    } else {
        const from = categoryUnits[currentCategory][fromUnit.value];
        const to = categoryUnits[currentCategory][toUnit.value];
        const result = (fromVal * from) / to;
        toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
    }
};

const swapUnits = () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;

    if (toValue.value && toValue.value !== '') {
        fromValue.value = toValue.value;
        performConversion();
    }
};

const resetValues = () => {
    fromValue.value = '';
    toValue.value = '';
    fromValue.focus();
};

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        populateUnits(currentCategory);
        resetValues();
    });
});

convertBtn.addEventListener('click', performConversion);
swapBtn.addEventListener('click', swapUnits);
resetBtn.addEventListener('click', resetValues);
fromValue.addEventListener('input', performConversion);
fromUnit.addEventListener('change', performConversion);
toUnit.addEventListener('change', performConversion);

populateUnits('length');