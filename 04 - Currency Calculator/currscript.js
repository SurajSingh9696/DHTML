const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO", AQD: "AQ", ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", XOF: "BE", BGN: "BG", BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS", NOK: "BV", BWP: "BW", BYR: "BY", BZD: "BZ", CAD: "CA", CDF: "CD", XAF: "CF", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU", CVE: "CV", CYP: "CY", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ", ECS: "EC", EEK: "EE", EGP: "EG", ETB: "ET", EUR: "FR", FJD: "FJ", FKP: "FK", GBP: "GB", GEL: "GE", GGP: "GG", GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK", HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS", JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KMF: "KM", KPW: "KP", KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA", LBP: "LB", LKR: "LK", LRD: "LR", LSL: "LS", LTL: "LT", LVL: "LV", LYD: "LY", MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO", MRO: "MR", MTL: "MT", MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA", XPF: "NC", NGN: "NG", NIO: "NI", NPR: "NP", NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL", PYG: "PY", QAR: "QA", RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA", SBD: "SB", SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SKK: "SK", SLL: "SL", SOS: "SO", SRD: "SR", STD: "ST", SVC: "SV", SYP: "SY", SZL: "SZ", THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ", VEF: "VE", VND: "VN", VUV: "VU", YER: "YE", ZAR: "ZA", ZMK: "ZM", ZWD: "ZW"
};

const popularCurrencies = {
    EUR: "", USD: "", JPY: "", BGN: "", CZK: "", DKK: "", GBP: "", HUF: "", PLN: "", RON: "", SEK: "", CHF: "", ISK: "", HRK: "", RUB: "", TRY: "", AUD: "", BRL: "", CAD: "", CNY: "", HKD: "", IDR: "", ILS: "", INR: "", KRW: "", MXN: "", MYR: "", NZD: "", PHP: "", SGD: "", THB: "", ZAR: ""
};

for (let currency in popularCurrencies) {
    for (let code in countryList) {
        if (currency === code) {
            popularCurrencies[currency] = countryList[code];
        }
    }
}

const convertBtn = document.querySelector("#but");
const dropdowns = document.querySelectorAll(".select select");
const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const resultMsg = document.querySelector("#msg");

const populateSelects = () => {
    dropdowns.forEach((select) => {
        for (let currency in popularCurrencies) {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = currency;
            
            if (select.name === "from" && currency === "USD") {
                option.selected = true;
            } else if (select.name === "to" && currency === "INR") {
                option.selected = true;
            }
            
            select.appendChild(option);
        }
        
        select.addEventListener("change", (e) => updateFlag(e.target));
    });
};

const updateFlag = (selectElement) => {
    const flagUrl = `https://flagsapi.com/${countryList[selectElement.value]}/flat/64.png`;
    
    if (selectElement.parentElement.classList.contains("from")) {
        document.querySelector("#imgfrom").src = flagUrl;
    } else {
        document.querySelector("#imgto").src = flagUrl;
    }
};

const convertCurrency = async () => {
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount < 0.01) {
        amountInput.value = 1;
        return;
    }

    try {
        const response = await fetch(
            `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ssDku6HS3kt3YRBvLu0stztbtCJCf9VuYaHesqYjdmss&currencies=${toSelect.value}&base_currency=${fromSelect.value}`
        );
        const data = await response.json();
        const exchangeRate = data.data[toSelect.value];
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        
        resultMsg.textContent = `${amount} ${fromSelect.value} = ${convertedAmount} ${toSelect.value}`;
    } catch (error) {
        resultMsg.textContent = "Error fetching exchange rates";
    }
};

convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    convertCurrency();
});

populateSelects();
convertCurrency();


  