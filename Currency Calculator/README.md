# Currency Converter

## Description
A modern, real-time currency converter with live exchange rates and country flags. Convert between 30+ popular currencies with an intuitive, responsive interface.

## Features
- **Real-Time Exchange Rates**: Live currency conversion using Free Currency API
- **30+ Popular Currencies**: Access major currencies worldwide
- **Country Flags**: Visual currency identification with flag icons
- **Modern UI**: Clean, gradient-based interface with smooth interactions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Instant Conversion**: Click to convert or get automatic rates
- **Error Handling**: Graceful fallback for API issues

## Supported Currencies
EUR, USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR

## Tech Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (Vanilla)**: Async/await for API calls
- **API**: Free Currency API for real-time rates
- **External**: Flags API for country flags
- **Google Fonts**: Poppins

## How to Use
1. Open `currindex.html` in a web browser
2. Enter the amount to convert
3. Select the "From" currency
4. Select the "To" currency
5. Click "Convert" to get the converted amount
6. Result displays automatically with live exchange rate

## Files
- `currindex.html` - Main HTML structure
- `currcss.css` - Modern responsive styling
- `currscript.js` - Currency conversion logic and API integration

## APIs Used
- **Free Currency API**: Real-time exchange rates
  - Base URL: https://api.freecurrencyapi.com/v1/latest
- **Flags API**: Country flag images
  - Format: https://flagsapi.com/{country_code}/flat/64.png

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes
- Requires internet connection for API calls
- Exchange rates update in real-time
- Default conversion: 1 USD to INR
