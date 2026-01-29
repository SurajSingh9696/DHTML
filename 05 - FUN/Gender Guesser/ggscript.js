const nameInput = document.querySelector("#name");
const predictBtn = document.querySelector("#but");
const outputDiv = document.querySelector("#output");
const genderValue = document.querySelector("#genderValue");
const accuracy = document.querySelector("#accuracy");

const predictGender = async () => {
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Please enter a name");
        return;
    }

    try {
        const response = await fetch(`https://api.genderize.io?name=${name}`);
        const data = await response.json();

        if (!data.gender) {
            genderValue.textContent = "Unknown";
            accuracy.textContent = "0";
        } else {
            genderValue.textContent = data.gender.charAt(0).toUpperCase() + data.gender.slice(1);
            accuracy.textContent = Math.round(data.probability * 100);
        }
        
        outputDiv.style.display = "flex";
    } catch (error) {
        alert("Error fetching gender prediction. Please try again.");
    }
};

predictBtn.addEventListener("click", predictGender);
nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") predictGender();
});
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Madagascar": "MG",
    "Malawi": "MW",
    "Malaysia": "MY",
    "Maldives": "MV",
    "Mali": "ML",
    "Malta": "MT",
    "Marshall Islands": "MH",
    "Mauritania": "MR",
    "Mauritius": "MU",
    "Mexico": "MX",
    "Micronesia": "FM",
    "Moldova": "MD",
    "Monaco": "MC",
    "Mongolia": "MN",
    "Montenegro": "ME",
    "Morocco": "MA",
    "Mozambique": "MZ",
    "Namibia": "NA",
    "Nauru": "NR",
    "Nepal": "NP",
    "Netherlands": "NL",
    "New Zealand": "NZ",
    "Nicaragua": "NI",
    "Niger": "NE",
    "Nigeria": "NG",
    "North Macedonia": "MK",
    "Norway": "NO",
    "Oman": "OM",
    "Pakistan": "PK",
    "Palau": "PW",
    "Palestine": "PS",
    "Panama": "PA",
    "Papua New Guinea": "PG",
    "Paraguay": "PY",
    "Peru": "PE",
    "Philippines": "PH",
    "Poland": "PL",
    "Portugal": "PT",
    "Qatar": "QA",
    "Romania": "RO",
    "Russia": "RU",
    "Rwanda": "RW",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    "Samoa": "WS",
    "San Marino": "SM",
    "Sao Tome and Principe": "ST",
    "Saudi Arabia": "SA",
    "Senegal": "SN",
    "Serbia": "RS",
    "Seychelles": "SC",
    "Sierra Leone": "SL",
    "Singapore": "SG",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Solomon Islands": "SB",
    "Somalia": "SO",
    "South Africa": "ZA",
    "South Sudan": "SS",
    "Spain": "ES",
    "Sri Lanka": "LK",
    "Sudan": "SD",
    "Suriname": "SR",
    "Sweden": "SE",
    "Switzerland": "CH",
    "Syria": "SY",
    "Taiwan": "TW",
    "Tajikistan": "TJ",
    "Tanzania": "TZ",
    "Thailand": "TH",
    "Timor-Leste": "TL",
    "Togo": "TG",
    "Tonga": "TO",
    "Trinidad and Tobago": "TT",
    "Tunisia": "TN",
    "Turkey": "TR",
    "Turkmenistan": "TM",
    "Tuvalu": "TV",
    "Uganda": "UG",
    "Ukraine": "UA",
    "United Arab Emirates": "AE",
    "United Kingdom": "GB",
    "United States": "US",
    "Uruguay": "UY",
    "Uzbekistan": "UZ",
    "Vanuatu": "VU",
    "Vatican City": "VA",
    "Venezuela": "VE",
    "Vietnam": "VN",
    "Yemen": "YE",
    "Zambia": "ZM",
    "Zimbabwe": "ZW"
};

const select = document.querySelector("#country");

const but = document.querySelector("#but")

const names = document.querySelector("#name");

const img = document.querySelector("#flag")

const output = document.querySelector("#output");

for(let count in countries){
    let option = document.createElement("option");
    option.innerText = count;
    option.value = countries[count];
    if(option.value === "global"){
        option.selected = selected;
    }
    select.append(option);

}
let URL;
but.addEventListener("click" , ()=>{
    let selected = select.value;
    let inname = names.value;
    console.log(inname);
    console.log(selected);
    if(selected == "global"){
         URL = `https://api.genderize.io?name=${inname}`;
    }
    else{
         URL = `https://api.genderize.io?name=${inname}&country_id=${selected}`;
    }
    
    console.log(URL)
    let update = async ()=>{
        let raw = await fetch(URL);
        let data = await raw.json();
        console.log(data);
        if(data.gender === null){
            output.innerHTML = `<b>Ans</b>: Can't find the gender with the particular counrty. Try Global.`
        }
        else{
            output.innerHTML = `<b>Ans</b>: Your gender is ${data.gender} with the probability of ${data.probability}`
        }
    }
    update();
})


select.addEventListener("change" , ()=>{
    let selected = select.value;
    console.log(img)

    if(selected === "global"){
        img.setAttribute("src" , "earth.png");
    }
    else{
        let url = `https://flagsapi.com/${selected}/flat/64.png`;
        img.setAttribute("src" , url);
    }
})

