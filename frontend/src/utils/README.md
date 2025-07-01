# Enhanced Toast Notification System

This directory contains utilities for creating beautiful, animated toast notifications throughout the Votely application.

## Features

- 🎨 **Beautiful Design**: Gradient backgrounds, custom icons, and smooth animations
- 🎯 **Type-Safe**: Predefined toast types with consistent styling
- ♿ **Accessible**: ARIA labels, keyboard navigation, and screen reader support
- 📱 **Responsive**: Adapts to different screen sizes
- 🌙 **Dark Mode**: Automatic theme adaptation
- ⚡ **Performance**: Hardware-accelerated animations and optimized rendering

## Quick Start

```javascript
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastUtils';

// Success notification
showSuccessToast('Operation completed!', 'Your changes have been saved successfully.');

// Error notification
showErrorToast('Something went wrong', 'Please try again later.');

// Info notification
showInfoToast('New feature available', 'Check out our latest updates.');
```

## Available Toast Types

### 1. Success Toast
```javascript
showSuccessToast(title, subtitle, options);
```
- **Theme**: Green gradient with checkmark icon
- **Use case**: Successful operations, confirmations

### 2. Error Toast
```javascript
showErrorToast(title, subtitle, options);
```
- **Theme**: Red gradient with X icon
- **Use case**: Errors, failures, warnings

### 3. Warning Toast
```javascript
showWarningToast(title, subtitle, options);
```
- **Theme**: Orange gradient with warning icon
- **Use case**: Warnings, important notices

### 4. Info Toast
```javascript
showInfoToast(title, subtitle, options);
```
- **Theme**: Blue gradient with info icon
- **Use case**: Information, tips, updates

### 5. Loading Toast
```javascript
showLoadingToast(title, subtitle, options);
```
- **Theme**: Purple gradient with spinning icon
- **Use case**: Loading states, async operations

### 6. Custom Toast
```javascript
showCustomToast(title, subtitle, options);
```
- **Theme**: Purple gradient with lightning icon
- **Use case**: Custom notifications, special events

## Advanced Usage

### Custom Options
```javascript
showSuccessToast('Title', 'Subtitle', {
  duration: 5000,           // Duration in milliseconds
  className: 'custom-class', // Custom CSS class
  style: {                  // Custom inline styles
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    fontSize: '16px'
  }
});
```

### Toast Management
```javascript
import { dismissToast, dismissAllToasts } from '../utils/toastUtils';

// Dismiss specific toast
const toastId = showLoadingToast('Loading...', 'Please wait');
setTimeout(() => dismissToast(toastId), 3000);

// Dismiss all toasts
dismissAllToasts();
```

### Custom Toast Content
```javascript
import { createToast } from '../utils/toastUtils';

createToast('custom', 'Custom Title', 'Custom subtitle', {
  duration: 4000,
  style: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
});
```

## Styling

### CSS Classes
The toast system uses the following CSS classes for styling:

- `.toast-notification` - Base toast styling
- `.toast-success-notification` - Success toast variant
- `.toast-error-notification` - Error toast variant
- `.toast-warning-notification` - Warning toast variant
- `.toast-info-notification` - Info toast variant
- `.toast-loading-notification` - Loading toast variant
- `.toast-custom-notification` - Custom toast variant

### Custom Styling
You can override default styles by adding custom CSS:

```css
.toast-custom-notification {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-left: 4px solid #667eea !important;
}
```

## Animations

The toast system includes several animations:

1. **Entrance Animation**: Slide in from right with scale effect
2. **Exit Animation**: Slide out to right with fade effect
3. **Hover Effects**: Subtle lift and scale on hover
4. **Icon Animations**: Gentle pulse effect on icons
5. **Progress Bar**: Animated progress bar at the bottom

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Focus management and keyboard shortcuts
- **Color Contrast**: High contrast ratios for readability
- **Reduced Motion**: Respects user's motion preferences

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Performance Considerations

- **Hardware Acceleration**: Uses `transform: translateZ(0)` for smooth animations
- **Efficient Rendering**: Optimized re-renders with React.memo
- **Memory Management**: Automatic cleanup of dismissed toasts
- **Bundle Size**: Tree-shakeable imports for minimal bundle impact

## Examples

### User Authentication
```javascript
// Login success
showSuccessToast('Welcome back!', 'Successfully logged in to your account.');

// Login error
showErrorToast('Login failed', 'Please check your credentials and try again.');

// Loading state
const loadingToast = showLoadingToast('Authenticating...', 'Please wait while we verify your credentials.');
// ... after API call
dismissToast(loadingToast);
showSuccessToast('Authentication successful!', 'Redirecting to dashboard...');
```

### Form Submissions
```javascript
// Form validation
showWarningToast('Please complete all fields', 'Some required fields are missing.');

// Form submission
showSuccessToast('Form submitted!', 'Your data has been saved successfully.');

// Network error
showErrorToast('Connection error', 'Please check your internet connection and try again.');
```

### File Operations
```javascript
// File upload
showInfoToast('Uploading file...', 'Please wait while we process your file.');

// Upload success
showSuccessToast('File uploaded!', 'Your file has been successfully uploaded.');

// Upload error
showErrorToast('Upload failed', 'The file could not be uploaded. Please try again.');
```

## Contributing

When adding new toast types or modifying existing ones:

1. Update the `TOAST_THEMES` object with new color schemes
2. Add corresponding icon in `ToastIcons`
3. Create a new helper function following the naming convention
4. Update this documentation
5. Test across different screen sizes and themes

## Troubleshooting

### Toast not appearing
- Check if the Toaster component is mounted in your app
- Verify that react-hot-toast is properly installed
- Ensure no CSS is hiding the toast container

### Styling issues
- Check for CSS conflicts with existing styles
- Verify that custom styles are being applied correctly
- Test in both light and dark modes

### Performance issues
- Avoid creating too many toasts simultaneously
- Use appropriate durations to prevent toast buildup
- Consider using `dismissAllToasts()` when navigating between pages 