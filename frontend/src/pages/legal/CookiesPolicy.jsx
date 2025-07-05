import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  Cog6ToothIcon, 
  InformationCircleIcon,
  EyeSlashIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const sections = [
  { id: 'summary', label: 'Summary', icon: GlobeAltIcon },
  { id: 'what-are-cookies', label: 'What Are Cookies', icon: InformationCircleIcon },
  { id: 'cookies-we-use', label: 'Cookies We Use', icon: Cog6ToothIcon },
  { id: 'third-party-cookies', label: 'Third-Party Cookies', icon: UserIcon },
  { id: 'cookie-controls', label: 'Cookie Controls', icon: EyeSlashIcon },
  { id: 'data-retention', label: 'Data Retention', icon: DocumentArrowDownIcon },
  { id: 'updates', label: 'Policy Updates', icon: ExclamationTriangleIcon },
  { id: 'contact', label: 'Contact', icon: LockClosedIcon },
];

export default function CookiesPolicy() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400/30 dark:bg-blue-500/20 opacity-70"></span>
              <Cog6ToothIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 drop-shadow-lg" aria-hidden="true" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight flex items-center gap-2">
              Cookies Policy
              <span className="inline-block align-middle ml-2 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-200 shadow-sm animate-fade-in">
                Updated
              </span>
            </h1>
          </div>
          <p className="text-lg md:text-xl px-0 md:px-12 text-gray-700 dark:text-gray-300 mb-4 md:mb-8 flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-400 dark:text-blue-300 mr-1" aria-hidden="true" />
            <span>
              <span className="font-medium">Effective Date:</span> <time dateTime="2025-06-01">June 2025</time>
            </span>
          </p>
          <p className="text-base md:text-lg px-0 md:px-12 text-gray-600 dark:text-gray-400 mb-2">
            This policy explains how Votely uses cookies and similar technologies to enhance your voting experience while maintaining your privacy and security.
          </p>
        </header>

        {/* Enhanced Quick Nav */}
        <nav
          aria-label="Cookies Policy Sections"
          className="mb-10 sticky top-4 z-20 bg-gradient-to-r from-white/80 via-blue-50/40 to-indigo-50/20 dark:from-[#15191e]/80 dark:via-[#1a1f26]/60 dark:to-[#1e242c]/30 rounded-xl backdrop-blur-md transition-all"
        >
          <ul className="flex flex-wrap gap-3 md:gap-4 justify-start md:justify-center py-2 px-2">
            {sections.map(({ id, label, icon: Icon }, idx) => (
              <li key={id} className="relative group/navitem">
                <a
                  href={`#${id}`}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-all duration-200 hover:shadow-md dark:shadow-none"
                  tabIndex={0}
                  aria-label={`Jump to ${label} section`}
                  onClick={e => {
                    e.preventDefault();
                    const el = document.getElementById(id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      el.focus({ preventScroll: true });
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        el.focus({ preventScroll: true });
                      }
                    }
                  }}
                >
                  <span className="relative flex items-center">
                    <Icon className="w-5 h-5 group-hover:scale-125 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-transform duration-200 drop-shadow-sm" aria-hidden="true" />
                    <span className="sr-only">{label} section</span>
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full group-focus-visible:w-full h-0.5 bg-blue-400 dark:bg-blue-300 rounded-full transition-all duration-200" aria-hidden="true"></span>
                </a>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-2 py-1 rounded bg-blue-700 text-white text-xs opacity-0 group-hover/navitem:opacity-90 group-focus-within/navitem:opacity-90 transition-opacity duration-200 shadow-lg whitespace-nowrap sm:hidden">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Summary */}
        <section
          id="summary"
          className="mb-10 relative"
          aria-labelledby="cookies-summary-heading"
        >
          <div className="absolute -top-4 -left-4 w-32 h-16 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="cookies-summary-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            Summary
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 z-10 relative">
            <p className="mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Votely</span> uses cookies and similar technologies to provide a secure, personalized, and accessible voting experience. We are committed to transparency about our cookie usage and giving you control over your privacy.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Essential Cookies:</span> Required for basic platform functionality, security, and accessibility features.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Performance Cookies:</span> Help us improve our services and ensure optimal performance for all users.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">No Tracking:</span> We do not use cookies for advertising, profiling, or tracking your activity across other websites.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">User Control:</span> You can manage your cookie preferences at any time through your browser settings or our platform.
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                Questions? See <a href="#contact" className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-200 transition">Contact</a> below.
              </span>
            </div>
          </div>
        </section>

        {/* What Are Cookies */}
        <section id="what-are-cookies" className="mb-10 relative" aria-labelledby="what-are-cookies-heading">
          <div className="absolute -top-4 -left-4 w-28 h-14 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="what-are-cookies-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <InformationCircleIcon className="w-5 h-5 text-blue-400" />
            What Are Cookies?
          </h2>
          <div className="text-gray-700 dark:text-gray-300 z-10 relative">
            <p className="mb-2">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling essential functionality.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Session Cookies:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Temporary cookies that are deleted when you close your browser. They help maintain your session and security.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Persistent Cookies:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Cookies that remain on your device for a set period. They remember your preferences and settings.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">First-Party Cookies:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Cookies set by Votely directly to provide our core services and functionality.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Third-Party Cookies:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Cookies set by external services we use for security, analytics, and accessibility features.
                </span>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <InformationCircleIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                We use cookies responsibly and only for purposes that enhance your voting experience and platform security.
              </span>
            </div>
          </div>
        </section>

        {/* Cookies We Use */}
        <section id="cookies-we-use" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-blue-400" />
            Cookies We Use
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We use different types of cookies for specific purposes. Each type serves a particular function to ensure our platform works effectively and securely.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Essential Cookies (Required)
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-2">
                These cookies are necessary for the platform to function properly and cannot be disabled.
              </p>
              <ul className="list-disc pl-6 text-green-700 dark:text-green-300 space-y-1">
                <li><span className="font-medium">Authentication:</span> Keep you logged in and secure your session</li>
                <li><span className="font-medium">Security:</span> Protect against fraud and unauthorized access</li>
                <li><span className="font-medium">Voting Integrity:</span> Ensure one vote per user and prevent duplicate voting</li>
                <li><span className="font-medium">Accessibility:</span> Remember your accessibility preferences and settings</li>
                <li><span className="font-medium">CSRF Protection:</span> Prevent cross-site request forgery attacks</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                Performance Cookies (Optional)
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-2">
                These cookies help us improve our services and provide better user experiences.
              </p>
              <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 space-y-1">
                <li><span className="font-medium">Analytics:</span> Understand how users interact with our platform (anonymized)</li>
                <li><span className="font-medium">Error Tracking:</span> Identify and fix technical issues quickly</li>
                <li><span className="font-medium">Performance Monitoring:</span> Ensure optimal loading times and responsiveness</li>
                <li><span className="font-medium">User Experience:</span> Remember your preferences for a personalized experience</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5" />
                Functional Cookies (Optional)
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-2">
                These cookies enable enhanced functionality and personalization features.
              </p>
              <ul className="list-disc pl-6 text-yellow-700 dark:text-yellow-300 space-y-1">
                <li><span className="font-medium">Language Preferences:</span> Remember your preferred language</li>
                <li><span className="font-medium">Theme Settings:</span> Store your light/dark mode preference</li>
                <li><span className="font-medium">Notification Settings:</span> Remember your notification preferences</li>
                <li><span className="font-medium">Form Data:</span> Temporarily store form data to prevent loss during submission</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section id="third-party-cookies" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-400" />
            Third-Party Cookies
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We may use third-party services that set their own cookies. These services help us provide security, analytics, and accessibility features.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Security Services:</span>
              <span className="ml-1">Services that help protect against fraud, DDoS attacks, and security threats.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Analytics Services:</span>
              <span className="ml-1">Anonymized analytics to help us understand platform usage and improve performance.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Accessibility Tools:</span>
              <span className="ml-1">Services that enhance accessibility features and compliance with WCAG guidelines.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Content Delivery:</span>
              <span className="ml-1">CDN services that improve loading speeds and global accessibility.</span>
            </li>
          </ul>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Important:</strong> We do not use third-party cookies for advertising or tracking purposes. All third-party services are carefully selected for their privacy practices and security standards.
            </p>
          </div>
        </section>

        {/* Cookie Controls */}
        <section id="cookie-controls" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <EyeSlashIcon className="w-5 h-5 text-blue-400" />
            Managing Your Cookie Preferences
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              You have control over your cookie preferences. However, please note that disabling certain cookies may affect platform functionality.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Browser Settings:</span>
              <span className="ml-1">Most browsers allow you to control cookies through their settings. You can block, delete, or manage cookies for specific websites.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Platform Settings:</span>
              <span className="ml-1">Access your cookie preferences through your Votely account settings and privacy controls.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Cookie Consent:</span>
              <span className="ml-1">When you first visit our platform, you'll see a cookie consent banner where you can choose your preferences.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Opt-Out Options:</span>
              <span className="ml-1">You can opt out of non-essential cookies while maintaining core platform functionality.</span>
            </li>
          </ul>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              How to Manage Cookies
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Chrome</h4>
                <p className="text-blue-700 dark:text-blue-300">Settings → Privacy and security → Cookies and other site data</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Firefox</h4>
                <p className="text-blue-700 dark:text-blue-300">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Safari</h4>
                <p className="text-blue-700 dark:text-blue-300">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Edge</h4>
                <p className="text-blue-700 dark:text-blue-300">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section id="data-retention" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5 text-blue-400" />
            Cookie Data Retention
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We retain cookie data only for as long as necessary to provide our services and maintain security. Different types of cookies have different retention periods.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Session Cookies:</span>
              <span className="ml-1">Deleted when you close your browser or after a period of inactivity.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Authentication Cookies:</span>
              <span className="ml-1">Typically expire after 30 days or when you log out.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Preference Cookies:</span>
              <span className="ml-1">Retained for up to 1 year or until you change your preferences.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Analytics Cookies:</span>
              <span className="ml-1">Retained for up to 2 years for service improvement purposes.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Security Cookies:</span>
              <span className="ml-1">Retained for the duration of your session plus a short security buffer period.</span>
            </li>
          </ul>
        </section>

        {/* Updates */}
        <section id="updates" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-400" />
            Policy Updates
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We may update this Cookies Policy periodically to reflect changes in our practices, technology, or legal requirements.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Notification:</span>
              <span className="ml-1">We will notify you of significant changes through our platform or email.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Review:</span>
              <span className="ml-1">We encourage you to review this policy periodically to stay informed.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Consent:</span>
              <span className="ml-1">Continued use of our platform after changes constitutes acceptance of the updated policy.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Effective Date:</span>
              <span className="ml-1">The effective date at the top of this policy indicates when it was last updated.</span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-blue-400" />
            Contact & Support
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 space-y-2">
            <p>
              If you have questions about our use of cookies or need help managing your preferences, we're here to assist you.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">General Support:</span>
                <span className="ml-1">Email us at <a href="mailto:support@votely.com" className="text-blue-600 dark:text-blue-400 underline">support@votely.com</a> for technical issues or general inquiries.</span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Privacy Questions:</span>
                <span className="ml-1">For privacy-specific questions about cookies, contact <a href="mailto:privacy@votely.com" className="text-blue-600 dark:text-blue-400 underline">privacy@votely.com</a>.</span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Technical Support:</span>
                <span className="ml-1">If you're having trouble with cookie settings or platform functionality, our technical team can help.</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <InformationCircleIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                We aim to respond to all inquiries within 2 business days. For urgent matters, please indicate "URGENT" in your email subject.
              </span>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col items-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>
            &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-300">Votely</span>. All rights reserved.
          </div>
          <div>
            <span>
              <a
                href="/terms"
                className="underline hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Terms of Service
              </a>
              <span className="mx-1">|</span>
              <a
                href="/privacy"
                className="underline hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Privacy Policy
              </a>
              <span className="mx-1">|</span>
              <a
                href="/cookies"
                className="underline hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Cookies Policy
              </a>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block rounded-full bg-green-400 w-2 h-2 mr-1" title="Uptime status"></span>
            <span>Service status: <span className="font-medium text-green-600 dark:text-green-400">Online</span></span>
          </div>
        </footer>
      </div>
    </main>
  );
} 