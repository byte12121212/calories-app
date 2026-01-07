

A modern, responsive web application for tracking daily calorie intake with advanced features including email validation and camera-based food scanning.

## Features

### Authentication
- **Secure Login/Signup** with password hashing (SHA-256)
- **Enhanced Email Validation**:
  - RFC 5322 compliant email format validation
  - MX record verification (checks if domain has valid mail servers)
  - Disposable email blacklist detection
  - Real-time validation feedback (valid/suspicious/invalid)

### Calorie Tracking
- **Manual Food Entry**: Add foods with name and calories
- **Camera Food Scanner**: 
  - Use device camera to scan food
  - AI-powered food recognition
  - AR-style calorie overlay
  - Automatic calorie estimation
- **Daily Tracking**: View total calories and food count for today
- **CRUD Operations**: Add, edit, and delete food entries
- **User-Specific Data**: Each user sees only their own entries

## File Structure

```
clickersim/
├── index.html              # Login page
├── register.html           # Sign up page
├── dashboard.html          # Main dashboard
├── css/
│   └── style.css          # All styles (responsive, mobile-optimized)
├── js/
│   ├── utils.js           # Utility functions (hashing, storage)
│   ├── emailValidation.js # Enhanced email validation system
│   ├── auth.js            # Authentication logic
│   ├── foodRecognition.js # Food recognition API integration
│   ├── cameraScanner.js   # Camera and AR overlay functionality
│   └── dashboard.js       # Dashboard and calorie tracking logic
└── README.md              # This file
```

## Setup Instructions

### 1. Local Development

1. **Clone or download** this project to your local machine

2. **Open the project** in a code editor

3. **Start a local server** (required for camera access):
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Access the app**:
   - Open your browser and navigate to `http://localhost:8000`
   - **Important**: Use HTTPS or localhost for camera access (required by browsers)

### 2. Food Recognition API Setup (Optional)

The app includes a fallback food recognition system, but for better accuracy:

1. **Choose an API service**:
   - [Edamam Food Database API](https://developer.edamam.com/food-database-api-docs)
   - [Spoonacular API](https://spoonacular.com/food-api)
   - [Clarifai Food Model](https://www.clarifai.com/models/food-image-recognition-model)

2. **Update configuration** in `js/foodRecognition.js`:
   ```javascript
   const FOOD_API_CONFIG = {
       endpoint: 'YOUR_API_ENDPOINT',
       apiKey: 'YOUR_API_KEY'
   };
   ```

3. **Update API response parsing** in `recognizeFoodFromImage()` function to match your API's response format

### 3. HTTPS Setup (Required for Camera on Production)

For production deployment, HTTPS is required for camera access:

- **Local Development**: Use `localhost` (works without HTTPS)
- **Production**: Deploy to a server with SSL certificate
- **Testing**: Use services like [ngrok](https://ngrok.com/) to create HTTPS tunnel

## Usage

### Sign Up
1. Navigate to the sign up page
2. Enter your email (real-time validation will check format, MX records, and disposable emails)
3. Create a password (minimum 6 characters)
4. Confirm password
5. Click "Sign Up"

### Login
1. Enter your registered email and password
2. Click "Sign In"

### Add Food - Manual Entry
1. Go to "Manual Entry" tab
2. Enter food name and calories
3. Click "Add Food"

### Add Food - Camera Scanner
1. Go to "Camera Scan" tab
2. Click "Start Camera Scanner"
3. Allow camera permissions when prompted
4. Point camera at food
5. Click "Capture" button
6. Review detected food and calories
7. Click "Add to Log" to save

### View and Manage Entries
- View daily calorie total and food count at the top
- See all foods logged today in the list
- Edit or delete entries using the action buttons

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Mobile Browsers**: Optimized for mobile screens

## Security Features

- **Password Hashing**: SHA-256 hashing for secure password storage
- **Email Validation**: Prevents fake/disposable emails
- **XSS Protection**: All user inputs are escaped
- **Local Storage**: Data stored locally (no server required)

## Technical Details

### Email Validation
- **RFC 5322 Regex**: Comprehensive email format validation
- **MX Record Check**: Verifies domain has mail servers using DNS-over-HTTPS
- **Disposable Email Detection**: 200+ known disposable email providers blocked

### Camera Scanner
- **getUserMedia API**: Access device camera
- **Image Processing**: Canvas-based image capture
- **Food Recognition**: API integration with local fallback
- **AR Overlay**: CSS-based floating calorie display

### Data Storage
- **localStorage**: All data stored in browser
- **User Isolation**: Each user's data is separate
- **Date Filtering**: Only shows today's entries

## Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for camera access
- Try a different browser
- Ensure device has a camera

### Email Validation Issues
- MX record check requires internet connection
- Some domains may not have MX records (uses A record fallback)
- Network errors won't block registration (shows warning)

### Food Recognition Not Accurate
- Update `FOOD_API_CONFIG` with a real API
- Improve `FOOD_DATABASE` with more food entries
- Consider using TensorFlow.js for local ML model

## License

This project is provided as-is for educational and personal use.

## Notes

- All data is stored locally in the browser
- No backend server required
- Works offline (except for email MX checks and food API)
- Mobile-optimized UI with large touch targets
- Responsive design works on all screen sizes

