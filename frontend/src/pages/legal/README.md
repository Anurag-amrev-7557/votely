# Legal Pages Documentation

This directory contains all the legal and compliance pages for the Votely platform. All pages follow a consistent design pattern inspired by the Privacy Policy page and include comprehensive accessibility features.

## Pages Overview

### 1. Privacy Policy (`PrivacyPolicy.jsx`)
- **Route**: `/privacy-policy`
- **Purpose**: Comprehensive privacy policy explaining data collection, usage, and user rights
- **Key Sections**:
  - Summary of privacy commitment
  - Data collection practices
  - How data is used
  - Security & compliance measures
  - User rights & choices
  - Data retention policies
  - Account deletion procedures
  - Contact information

### 2. Terms of Service (`TermsOfService.jsx`)
- **Route**: `/terms-of-service`
- **Purpose**: Legal terms governing the use of Votely's platform
- **Key Sections**:
  - Service summary and commitment
  - Acceptance of terms
  - Service description
  - User obligations and prohibited activities
  - Intellectual property rights
  - Liability limitations
  - Account termination policies
  - Governing law and dispute resolution

### 3. Cookies Policy (`CookiesPolicy.jsx`)
- **Route**: `/cookies-policy`
- **Purpose**: Detailed explanation of cookie usage and user controls
- **Key Sections**:
  - What are cookies
  - Types of cookies used (Essential, Performance, Functional)
  - Third-party cookies
  - Cookie management and controls
  - Data retention for cookies
  - Policy updates

### 4. Accessibility Statement (`AccessibilityStatement.jsx`)
- **Route**: `/accessibility-statement`
- **Purpose**: Commitment to accessibility and compliance information
- **Key Sections**:
  - Accessibility commitment
  - Compliance standards (WCAG 2.1 AA, Section 508)
  - Accessibility features
  - Assistive technology compatibility
  - Feedback and support
  - Continuous improvement processes

## Design Features

### Consistent Styling
All pages follow the same design pattern with:
- Gradient backgrounds with light/dark mode support
- Animated navigation with smooth scrolling
- Consistent typography and spacing
- Interactive elements with hover effects
- Responsive design for all screen sizes

### Accessibility Features
- **WCAG 2.1 AA Compliance**: All pages meet accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast modes
- **Focus Management**: Clear focus indicators
- **Alternative Text**: Descriptive text for all images and icons

### Navigation
- **Sticky Navigation**: Quick jump links that stay visible
- **Smooth Scrolling**: Animated scrolling to sections
- **Section Headers**: Clear section identification with icons
- **Breadcrumb Navigation**: Easy navigation between sections

### Interactive Elements
- **Hover Effects**: Visual feedback on interactive elements
- **Tooltips**: Helpful information on hover
- **Animated Icons**: Subtle animations for better UX
- **Loading States**: Smooth loading transitions

## Technical Implementation

### File Structure
```
frontend/src/pages/legal/
├── PrivacyPolicy.jsx
├── TermsOfService.jsx
├── CookiesPolicy.jsx
├── AccessibilityStatement.jsx
└── README.md
```

### Routing Configuration
All pages are configured in `App.jsx` with the following routes:
- `/privacy-policy` → PrivacyPolicy
- `/terms-of-service` → TermsOfService
- `/cookies-policy` → CookiesPolicy
- `/accessibility-statement` → AccessibilityStatement

### Footer Integration
All legal pages are linked in the footer navigation with:
- Proper React Router Link components
- Accessible labels and descriptions
- Consistent styling with the rest of the footer

## Content Guidelines

### Writing Style
- **Clear and Concise**: Easy to understand language
- **Professional**: Appropriate for legal documents
- **Inclusive**: Accessible to users with diverse abilities
- **Transparent**: Honest and open about practices

### Legal Compliance
- **GDPR Compliance**: European data protection regulations
- **Section 508**: Federal accessibility requirements
- **WCAG 2.1 AA**: Web accessibility guidelines
- **Industry Standards**: Following best practices for legal documents

### Regular Updates
- **Effective Dates**: Clearly marked update dates
- **Version Control**: Track changes over time
- **User Notification**: Inform users of significant changes
- **Review Process**: Regular legal review and updates

## Maintenance

### Content Updates
1. Update the effective date when making changes
2. Review content for accuracy and compliance
3. Test accessibility features after updates
4. Update this documentation as needed

### Technical Maintenance
1. Ensure all links work correctly
2. Test responsive design on various devices
3. Verify accessibility compliance
4. Update dependencies as needed

### Legal Review
1. Regular review by legal team
2. Compliance with changing regulations
3. Industry best practice updates
4. User feedback integration

## Contact Information

For questions about these legal pages:
- **General Support**: support@votely.com
- **Privacy Questions**: privacy@votely.com
- **Legal Matters**: legal@votely.com
- **Accessibility**: accessibility@votely.com

---

*Last Updated: June 2025*
*Version: 1.0* 