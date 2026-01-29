const nameInput = document.querySelector("#name");
const guessBtn = document.querySelector("#start");
const outputDiv = document.querySelector("#output");
const countryValue = document.querySelector("#countryValue");
const probability = document.querySelector("#probability");

const guessCountry = async () => {
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Please enter a name");
        return;
    }

    try {
        const response = await fetch(`https://api.nationalize.io?name=${name}`);
        const data = await response.json();

        if (!data.country || data.country.length === 0) {
            countryValue.textContent = "Unknown";
            probability.textContent = "0";
        } else {
            const topCountry = data.country[0];
            countryValue.textContent = topCountry.country_id;
            probability.textContent = Math.round(topCountry.probability * 100);
        }
        
        outputDiv.style.display = "flex";
    } catch (error) {
        alert("Error fetching country prediction. Please try again.");
    }
};

guessBtn.addEventListener("click", guessCountry);
nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") guessCountry();
});
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "MX": "Mexico",
    "FM": "Micronesia",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "MK": "North Macedonia",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "QA": "Qatar",
    "RO": "Romania",
    "RU": "Russia",
    "RW": "Rwanda",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syria",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VA": "Vatican City",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
};



const names = document.querySelector("#name");

const but = document.querySelector("#start");

const output = document.querySelector("#output");

but.addEventListener("click" , ()=>{
    let name = names.value;
    let URL = `https://api.nationalize.io/?name=${name}`;
    let out = async ()=>{
        let raw = await fetch(URL);
        let data = await raw.json();
        output.innerHTML = `<b>Ans:</b> Your Country might be ${countries[data.country[0].country_id]}`
    }
    out();
})