import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  UserIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  EyeSlashIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const sections = [
  { id: 'summary', label: 'Summary', icon: GlobeAltIcon },
  { id: 'data-we-collect', label: 'Data We Collect', icon: UserIcon },
  { id: 'how-we-use', label: 'How We Use Data', icon: Cog6ToothIcon },
  { id: 'security', label: 'Security & Compliance', icon: ShieldCheckIcon },
  { id: 'user-rights', label: 'Your Rights & Choices', icon: EyeSlashIcon },
  { id: 'retention', label: 'Data Retention', icon: DocumentArrowDownIcon },
  { id: 'deletion', label: 'Account Deletion', icon: TrashIcon },
  { id: 'contact', label: 'Contact', icon: LockClosedIcon },
];

export default function PrivacyPolicy() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400/30 dark:bg-blue-500/20 opacity-70"></span>
              <ShieldCheckIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 drop-shadow-lg" aria-hidden="true" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight flex items-center gap-2">
              Privacy Policy
              <span className="inline-block align-middle ml-2 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-200 shadow-sm animate-fade-in">
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
            Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights. We are committed to transparency and security.
          </p>
        </header>

        {/* Enhanced Quick Nav */}
        <nav
          aria-label="Privacy Policy Sections"
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
                    // Smooth scroll for accessibility
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
                    <Icon className="w-5 h-5 group-hover:scale-125 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-transform duration-200 drop-shadow-sm" aria-hidden="true" />
                    <span className="sr-only">{label} section</span>
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                  {/* Animated underline for active/hover state */}
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full group-focus-visible:w-full h-0.5 bg-blue-400 dark:bg-blue-300 rounded-full transition-all duration-200" aria-hidden="true"></span>
                </a>
                {/* Tooltip on hover for mobile/short screens */}
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
          aria-labelledby="privacy-summary-heading"
        >
          <div className="absolute -top-4 -left-4 w-32 h-16 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="privacy-summary-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            Summary
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 z-10 relative">
            <p className="mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Votely</span> is dedicated to safeguarding your privacy and personal data. Our platform is designed with security, transparency, and accessibility at its core, ensuring a trustworthy voting experience for everyone.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Minimal Data Collection:</span> We only collect information essential to provide and improve our services.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Global Compliance:</span> We adhere to leading privacy and security standards, including <abbr title="General Data Protection Regulation" className="underline decoration-dotted cursor-help">GDPR</abbr>, ISO 27001, SOC 2, and accessibility guidelines (<abbr title="Web Content Accessibility Guidelines" className="underline decoration-dotted cursor-help">WCAG 2.1 AA</abbr>, Section 508).
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">No Data Selling:</span> Your data is <span className="underline decoration-wavy decoration-blue-400">never</span> sold or shared with third parties for marketing or advertising.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">User Empowerment:</span> You control your data, with clear options to access, export, or delete your information at any time.
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

        {/* Data We Collect */}
        <section id="data-we-collect" className="mb-10 relative" aria-labelledby="data-we-collect-heading">
          <div className="absolute -top-4 -left-4 w-28 h-14 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="data-we-collect-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <UserIcon className="w-5 h-5 text-blue-400" />
            Data We Collect
          </h2>
          <div className="text-gray-700 dark:text-gray-300 z-10 relative">
            <p className="mb-2">
              We are committed to collecting only the data necessary to provide a secure, accessible, and personalized voting experience. Here’s a transparent breakdown of what we collect and why:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Account Information:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Name, email address, <span className="italic">hashed</span> password, profile photo, bio, and optional social links.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Used for authentication, personalization, and profile display.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Preferences:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Theme (light/dark), notification settings, language, timezone.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Helps us tailor your experience and accessibility.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Voting Activity:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Votes cast, polls created, comments, shares, and participation statistics.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Enables core platform features and analytics.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Security Data:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Device fingerprint, two-factor authentication (2FA) status, login history, anonymized voting metadata.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Protects your account and ensures voting integrity.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Usage Data:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Browser and device information, IP address <span className="italic">(for security only)</span>, cookies.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Used for security, troubleshooting, and improving our services. Never sold or used for advertising.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Accessibility Settings & Feedback:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Custom accessibility preferences (e.g., font size, contrast), and any feedback you provide to help us improve accessibility.
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 ml-1">Ensures our platform is inclusive and responsive to your needs.</span>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                We <span className="font-semibold text-blue-700 dark:text-blue-300">never</span> collect sensitive personal data (e.g., government ID, financial info) or use your data for profiling or advertising.
              </span>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section id="how-we-use" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-blue-400" />
            How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Account Management:</span>
              <span className="ml-1">We use your information to create, maintain, and personalize your account and profile, including your preferences and accessibility settings.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Voting & Participation:</span>
              <span className="ml-1">Your data enables secure voting, poll creation, commenting, and participation in platform activities, while maintaining vote integrity and anonymity where applicable.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Personalization & Accessibility:</span>
              <span className="ml-1">We tailor features, notifications, and accessibility options (such as dark mode, language, or assistive settings) to enhance your experience.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Security & Fraud Prevention:</span>
              <span className="ml-1">We analyze login activity, device data, and usage patterns to detect and prevent fraud, abuse, and unauthorized access, and to protect your account and voting rights.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Platform Improvement & Analytics:</span>
              <span className="ml-1">Aggregated, anonymized data helps us understand usage trends, improve features, and ensure our platform is accessible and reliable for all users.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Legal & Compliance:</span>
              <span className="ml-1">We may process your data to comply with legal obligations, respond to lawful requests, and uphold the integrity of democratic processes.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <Cog6ToothIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Transparency:</span>
            </span>
            <span>
              We <span className="font-semibold text-blue-700 dark:text-blue-300">never</span> use your data for advertising, profiling, or selling to third parties. All uses are strictly for platform functionality, security, and compliance.
            </span>
          </div>
        </section>

        {/* Security & Compliance */}
        <section id="security" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
            Security & Compliance
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We are deeply committed to protecting your privacy and the integrity of your votes. Our platform is built with industry-leading security practices and undergoes continuous improvement to stay ahead of emerging threats.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">End-to-End Encryption:</span>
              <span className="ml-1">All votes and sensitive data are encrypted in transit and at rest, ensuring only authorized parties can access your information.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Multi-Factor Authentication (2FA):</span>
              <span className="ml-1">We support 2FA and device fingerprinting to prevent unauthorized access to your account.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Anonymous & Verifiable Voting:</span>
              <span className="ml-1">We offer anonymous voting options and use cryptographic anonymization to separate your identity from your vote, while maintaining verifiability and auditability.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Continuous Security Audits:</span>
              <span className="ml-1">Our systems undergo regular third-party security audits, penetration testing, and vulnerability assessments.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Compliance & Accessibility:</span>
              <span className="ml-1">We comply with global standards including <abbr title="General Data Protection Regulation">GDPR</abbr>, <abbr title="International Organization for Standardization">ISO 27001</abbr>, <abbr title="Service Organization Control 2">SOC 2</abbr>, <abbr title="Web Content Accessibility Guidelines">WCAG 2.1 AA</abbr>, and <abbr title="Section 508 of the Rehabilitation Act">Section 508</abbr> to ensure your data is handled lawfully and our platform is accessible to all.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Strict Access Controls:</span>
              <span className="ml-1">Only authorized personnel can access sensitive systems, with all access logged and regularly reviewed. We use the principle of least privilege and maintain detailed audit trails.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Incident Response:</span>
              <span className="ml-1">We have a robust incident response plan to quickly address and notify users of any security issues or breaches, in accordance with legal requirements.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Your Security Matters:</span>
            </span>
            <span>
              We continually invest in advanced security technologies and best practices to safeguard your data and the democratic process. If you have security concerns or discover a vulnerability, please contact us immediately at <a href="mailto:security@votely.com" className="text-blue-700 dark:text-blue-400 underline">security@votely.com</a>.
            </span>
          </div>
        </section>

        {/* User Rights & Choices */}
        <section id="user-rights" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <EyeSlashIcon className="w-5 h-5 text-blue-400" />
            Your Rights & Choices
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We believe in empowering you with full control over your personal information and digital footprint. As a Votely user, you have a range of rights and choices to manage your privacy and data:
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Access & Correction:</span>
              <span className="ml-1">View, update, or correct your personal data at any time in your profile settings.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Data Portability:</span>
              <span className="ml-1">Export your data in a machine-readable format whenever you wish (see Profile & Data settings).</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Account & Data Deletion:</span>
              <span className="ml-1">Permanently delete your account and all associated data. This action is irreversible and can be done from your profile settings.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Privacy & Notification Preferences:</span>
              <span className="ml-1">Customize your privacy settings and choose which notifications you receive.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Communication Choices:</span>
              <span className="ml-1">Opt-in or opt-out of marketing, product updates, and other communications at any time.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Transparency:</span>
              <span className="ml-1">Request detailed information about how your data is collected, used, and protected.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Objection & Restriction:</span>
              <span className="ml-1">Object to or restrict certain types of data processing, as permitted by law.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Withdraw Consent:</span>
              <span className="ml-1">Withdraw your consent for data processing where consent is the legal basis, without affecting the lawfulness of processing before withdrawal.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <EyeSlashIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Need Help?</span>
            </span>
            <span>
              To exercise any of these rights, visit your <a href="/profile" className="text-blue-700 dark:text-blue-400 underline">Profile</a> or <a href="mailto:privacy@votely.com" className="text-blue-700 dark:text-blue-400 underline">contact our privacy team</a>. We respond promptly to all requests and are committed to supporting your privacy choices.
            </span>
          </div>
        </section>

        {/* Data Retention */}
        <section id="retention" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5 text-blue-400" />
            Data Retention & Storage
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 space-y-2">
            <p>
              At Votely, we are committed to minimizing the amount of data we retain and to storing it securely. We keep your personal information only for as long as it is necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Deliver and maintain our services, including your voting history and account preferences.</li>
              <li>Comply with legal, regulatory, and contractual obligations.</li>
              <li>Resolve disputes, enforce our terms, and ensure the integrity and security of our platform.</li>
            </ul>
            <p>
              We regularly review our data retention practices to ensure we do not keep your information longer than needed. When your data is no longer required, we securely delete or anonymize it.
            </p>
            <p>
              <span className="font-medium text-blue-700 dark:text-blue-300">Your Control:</span> You may request deletion of your data at any time via your <a href="/profile" className="text-blue-700 dark:text-blue-400 underline">Profile</a> or by <a href="mailto:privacy@votely.com" className="text-blue-700 dark:text-blue-400 underline">contacting our privacy team</a>. We will honor your request unless retention is required by law (e.g., for fraud prevention or legal compliance).
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <InformationCircleIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                For more details on how long specific types of data are retained, please refer to our <a href="/faq" className="text-blue-700 dark:text-blue-400 underline">FAQ</a> or reach out to us directly.
              </span>
            </div>
          </div>
        </section>

        {/* Account Deletion */}
        <section id="deletion" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <TrashIcon className="w-5 h-5 text-blue-400" />
            Account Deletion & Data Erasure
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 space-y-2">
            <p>
              We believe in your right to be forgotten. You can permanently delete your account and all associated data at any time from your <a href="/profile" className="text-blue-700 dark:text-blue-400 underline">Profile settings</a>. This process is designed to be simple and transparent.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Irreversible:</span>
                <span className="ml-1">Account deletion is permanent. Once deleted, your data cannot be recovered.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">What is deleted:</span>
                <span className="ml-1">Your personal information, voting history, and profile data will be removed from our systems.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">What may be retained:</span>
                <span className="ml-1">Some data may be retained if required by law (e.g., for fraud prevention, legal compliance, or security purposes). Such data will be minimized and protected.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">How to delete:</span>
                <span className="ml-1">Go to your <a href="/profile" className="text-blue-700 dark:text-blue-400 underline">Profile</a> and select <span className="font-semibold">Delete Account</span>. You may be asked to confirm your identity for security.</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" aria-hidden="true" />
              <span>
                If you need assistance or have concerns about account deletion, please <a href="mailto:privacy@votely.com" className="text-blue-700 dark:text-blue-400 underline">contact our privacy team</a>. We are here to help and will respond promptly.
              </span>
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section id="contact" className="mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-blue-400" />
            Contact & Support
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 space-y-2">
            <p>
              Your privacy matters to us. If you have any questions, concerns, or requests regarding your privacy, your data, or this policy, please reach out. We are committed to responding promptly and transparently.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">General Support:</span>
                <span className="ml-1">Email us at <a href="mailto:support@votely.com" className="text-blue-700 dark:text-blue-400 underline">support@votely.com</a> for any general inquiries or technical issues.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Privacy Requests:</span>
                <span className="ml-1">For privacy-specific questions, data access, or deletion requests, contact our privacy team at <a href="mailto:privacy@votely.com" className="text-blue-700 dark:text-blue-400 underline">privacy@votely.com</a>.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Feedback:</span>
                <span className="ml-1">We welcome your feedback to help us improve. Let us know how we can serve you better.</span>
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
            &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700 dark:text-blue-300">Votely</span>. All rights reserved.
          </div>
          <div>
            <span>
              <a
                href="/terms"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Terms of Service
              </a>
              <span className="mx-1">|</span>
              <a
                href="/privacy"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Privacy Policy
              </a>
              <span className="mx-1">|</span>
              <a
                href="mailto:privacy@votely.com"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Contact Privacy Team
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
