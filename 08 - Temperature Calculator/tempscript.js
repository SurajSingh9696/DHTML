const fromUnit = document.querySelector('#from-unit');
const toUnit = document.querySelector('#to-unit');
const fromValue = document.querySelector('#from-value');
const toValue = document.querySelector('#to-value');
const convertBtn = document.querySelector('#convert-btn');
const swapBtn = document.querySelector('#swap-btn');

const conversionRates = {
    'C-F': (c) => (c * 9/5) + 32,
    'C-K': (c) => c + 273.15,
    'F-C': (f) => (f - 32) * 5/9,
    'F-K': (f) => ((f - 32) * 5/9) + 273.15,
    'K-C': (k) => k - 273.15,
    'K-F': (k) => ((k - 273.15) * 9/5) + 32
};

const performConversion = () => {
    const from = fromUnit.value;
    const to = toUnit.value;
    const inputTemp = parseFloat(fromValue.value);

    if (isNaN(inputTemp)) {
        toValue.value = '';
        return;
    }

    if (from === to) {
        toValue.value = inputTemp.toFixed(2);
    } else {
        const key = `${from}-${to}`;
        const result = conversionRates[key](inputTemp);
        toValue.value = result.toFixed(2);
    }
};

const swapUnits = () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;

    if (toValue.value && toValue.value !== '') {
        fromValue.value = toValue.value;
        performConversion();
    }
};

convertBtn.addEventListener('click', performConversion);
swapBtn.addEventListener('click', swapUnits);
fromValue.addEventListener('input', performConversion);
fromValue.addEventListener('change', performConversion);
fromUnit.addEventListener('change', performConversion);
toUnit.addEventListener('change', performConversion);