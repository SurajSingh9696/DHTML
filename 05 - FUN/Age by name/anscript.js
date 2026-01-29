const nameInput = document.querySelector("#name");
const predictBtn = document.querySelector("#but");
const outputDiv = document.querySelector("#output");
const ageValue = document.querySelector("#ageValue");
const accuracy = document.querySelector("#accuracy");

const predictAge = async () => {
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Please enter a name");
        return;
    }

    try {
        const response = await fetch(`https://api.agify.io?name=${name}`);
        const data = await response.json();

        if (data.age === null) {
            ageValue.textContent = "?";
            accuracy.textContent = "0";
        } else {
            ageValue.textContent = data.age;
            accuracy.textContent = Math.min(100, Math.round((data.count / 1000) * 100));
        }
        
        outputDiv.style.display = "flex";
    } catch (error) {
        alert("Error fetching age prediction. Please try again.");
    }
};

predictBtn.addEventListener("click", predictAge);
nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") predictAge();
});

