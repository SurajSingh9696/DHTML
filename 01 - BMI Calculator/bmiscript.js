const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");
const calculateBtn = document.querySelector("#calculateBtn");
const bmiNo = document.querySelector("#bmino");
const bmiStatus = document.querySelector("#bmistatus");
const resultsDiv = document.querySelector("#results");
const rangeItems = document.querySelectorAll(".range-item");

const calculateBMI = () => {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert("Please enter valid height and weight values");
        return;
    }

    const bmi = weight / (height * height);
    bmiNo.textContent = bmi.toFixed(1);
    
    let status = "";
    let statusColor = "";

    if (bmi < 18.5) {
        status = "Underweight";
        statusColor = "#ff6b6b";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        status = "Healthy Weight";
        statusColor = "#51cf66";
    } else if (bmi >= 25 && bmi <= 29.9) {
        status = "Overweight";
        statusColor = "#ffa500";
    } else if (bmi >= 30 && bmi <= 39.9) {
        status = "Obese";
        statusColor = "#ff4757";
    } else {
        status = "Severely Obese";
        statusColor = "#c41e3a";
    }

    bmiStatus.textContent = status;
    resultsDiv.style.display = "block";
    
    rangeItems.forEach(item => {
        item.classList.remove("active");
        const rangeText = item.querySelector("span:last-child").textContent;
        
        if ((bmi < 18.5 && rangeText.includes("< 18.5")) ||
            (bmi >= 18.5 && bmi < 25 && rangeText.includes("18.5 - 24.9")) ||
            (bmi >= 25 && bmi < 30 && rangeText.includes("25 - 29.9")) ||
            (bmi >= 30 && rangeText.includes(">= 30"))) {
            item.classList.add("active");
        }
    });
};

calculateBtn.addEventListener("click", calculateBMI);

heightInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateBMI();
});

weightInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateBMI();
});