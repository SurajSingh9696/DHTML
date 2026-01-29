# CalcPro - Advanced Scientific Calculator

A modern, feature-rich calculator application with both basic and scientific modes built with HTML, CSS, and JavaScript.

## Features

### Core Functionality
- ✅ **Basic Operations** - Addition, Subtraction, Multiplication, Division
- 🔬 **Scientific Operations** - sin, cos, tan, √, x², xʸ, log, ln
- 📊 **Advanced Functions** - Percentage, Power, Constants (π, e)
- 🧮 **Memory Functions** - MC (Clear), MR (Recall), M+ (Add), M- (Subtract)
- 📜 **Calculation History** - Stores last 50 calculations
- ⌨️ **Keyboard Support** - Full keyboard input support
- 💾 **Local Storage** - All history and settings persist

### Modes
- **Basic Mode** - Standard calculator layout (4x4 grid)
- **Scientific Mode** - Extended layout with scientific functions (5x6 grid)

### Operations

**Basic Operations:**
- Addition (+)
- Subtraction (−)
- Multiplication (×)
- Division (÷)
- Percentage (%)
- Negate (+/−)

**Scientific Operations:**
- Trigonometric: sin, cos, tan (in degrees)
- Square root (√)
- Square (x²)
- Power (xʸ)
- Logarithm (log base 10)
- Natural logarithm (ln)
- Constants: π (pi), e (euler's number)

**Memory Functions:**
- MC - Clear memory
- MR - Recall stored value
- M+ - Add current value to memory
- M- - Subtract current value from memory

## Design Features

### Modern UI
- 🌙 Dark theme with gradient backgrounds
- ☀️ Light theme with clean design
- 💫 Smooth animations and transitions
- 🎭 Hover effects on all buttons
- 📱 Fully responsive design
- 🎨 Color-coded button types

### Button Categories
- **Number Buttons** - White/light background
- **Operator Buttons** - Purple gradient
- **Function Buttons** - Orange gradient
- **Special Buttons** - Blue gradient
- **Equals Button** - Green gradient with emphasis

### Typography
- **Orbitron** - Modern tech font for heading
- **Roboto Mono** - Monospace font for display and numbers
- **Poppins** - Clean font for UI elements

### Animations
- Fade-in effects on page load
- Slide-in animations for history items
- Pulse effects for icons
- Scale transforms on button hover
- Smooth theme transitions

## How to Use

### Basic Calculations
1. Click number buttons or type on keyboard
2. Click operator (+, −, ×, ÷)
3. Enter second number
4. Press = or Enter to calculate

### Scientific Functions
1. Switch to Scientific mode
2. Enter a number
3. Click function button (sin, cos, √, etc.)
4. Result appears instantly

### Memory Functions
1. Calculate a value
2. Click M+ to store it
3. Perform other calculations
4. Click MR to recall stored value
5. Click MC to clear memory

### History
1. Click History button to view past calculations
2. Click any history item to load its result
3. Click Clear to remove all history

### Keyboard Shortcuts
- **0-9** - Number input
- **.** - Decimal point
- **+, -, *, /** - Operators
- **Enter or =** - Calculate result
- **Escape** - Clear all
- **Backspace** - Delete last digit

## Advanced Features

### Error Handling
- Division by zero detection
- Negative square root prevention
- Invalid logarithm input validation
- Clear error messages

### Display Features
- Auto-formatting of long numbers
- Scientific notation for very large/small numbers
- Expression preview in history display
- Memory value indicator

### History Panel
- Stores up to 50 calculations
- Shows expression and result
- Click to reuse results
- Clear all option
- Persistent storage

## Technical Details

- **Pure JavaScript** - No frameworks required
- **Local Storage API** - For data persistence
- **CSS Grid & Flexbox** - For responsive layouts
- **CSS Animations** - For smooth transitions
- **Font Awesome** - For icons
- **Google Fonts** - For typography

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints
- Desktop: 768px+
- Tablet: 640px - 767px
- Mobile: 480px - 639px
- Small Mobile: 360px - 479px

## Math Precision
- Handles up to 12-digit display
- Scientific notation for larger numbers
- Radian to degree conversion for trig functions
- Proper order of operations

---

Calculate with ❤️ precision
