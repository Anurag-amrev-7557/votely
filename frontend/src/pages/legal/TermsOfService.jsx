import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HandRaisedIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const sections = [
  { id: 'summary', label: 'Summary', icon: GlobeAltIcon },
  { id: 'acceptance', label: 'Acceptance', icon: HandRaisedIcon },
  { id: 'services', label: 'Services', icon: Cog6ToothIcon },
  { id: 'user-conduct', label: 'User Conduct', icon: UserIcon },
  { id: 'intellectual-property', label: 'Intellectual Property', icon: DocumentTextIcon },
  { id: 'privacy-security', label: 'Privacy & Security', icon: ShieldCheckIcon },
  { id: 'liability', label: 'Liability', icon: ScaleIcon },
  { id: 'termination', label: 'Termination', icon: ExclamationTriangleIcon },
  { id: 'contact', label: 'Contact', icon: LockClosedIcon },
];

export default function TermsOfService() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400/30 dark:bg-blue-500/20 opacity-70"></span>
              <DocumentTextIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 drop-shadow-lg" aria-hidden="true" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight flex items-center gap-2">
              Terms of Service
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
            These terms govern your use of Votely's voting platform. By using our services, you agree to these terms and our commitment to secure, accessible, and transparent voting.
          </p>
        </header>

        {/* Enhanced Quick Nav */}
        <nav
          aria-label="Terms of Service Sections"
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
                    <Icon className="w-5 h-5 group-hover:scale-125 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-transform duration-200 drop-shadow-sm" aria-hidden="true" />
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
          aria-labelledby="terms-summary-heading"
        >
          <div className="absolute -top-4 -left-4 w-32 h-16 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="terms-summary-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            Summary
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 z-10 relative">
            <p className="mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Votely</span> provides a secure, accessible, and transparent voting platform designed to empower democratic participation. These terms outline the rules and responsibilities for using our services.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Service Description:</span> Votely offers secure online voting, poll creation, and democratic engagement tools with accessibility features.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">User Responsibilities:</span> Users must provide accurate information, follow platform rules, and respect others' rights and privacy.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Security & Compliance:</span> We maintain high security standards and comply with relevant laws and accessibility guidelines.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Intellectual Property:</span> Users retain rights to their content while granting Votely license to provide services.
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Liability & Termination:</span> Clear limits on liability and conditions for account termination or service suspension.
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <DocumentTextIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                Questions? See <a href="#contact" className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-200 transition">Contact</a> below.
              </span>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section id="acceptance" className="mb-10 relative" aria-labelledby="acceptance-heading">
          <div className="absolute -top-4 -left-4 w-28 h-14 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="acceptance-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <HandRaisedIcon className="w-5 h-5 text-blue-400" />
            Acceptance of Terms
          </h2>
          <div className="text-gray-700 dark:text-gray-300 z-10 relative">
            <p className="mb-2">
              By accessing or using Votely's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Agreement:</span>
                <span className="ml-1">Your use of Votely constitutes acceptance of these terms and any future modifications.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Age Requirement:</span>
                <span className="ml-1">You must be at least 13 years old to use Votely. Users under 18 must have parental consent.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Legal Capacity:</span>
                <span className="ml-1">You represent that you have the legal capacity to enter into these terms and use our services.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Updates:</span>
                <span className="ml-1">We may update these terms periodically. Continued use after changes constitutes acceptance.</span>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <HandRaisedIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                If you do not agree to these terms, please do not use our services.
              </span>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-blue-400" />
            Description of Services
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Votely provides a comprehensive voting and democratic engagement platform designed to facilitate secure, transparent, and accessible voting processes.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Voting Platform:</span>
              <span className="ml-1">Secure online voting with cryptographic verification, anonymous voting options, and real-time results.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Poll Creation:</span>
              <span className="ml-1">Tools to create, customize, and manage polls with various question types and voting methods.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Accessibility Features:</span>
              <span className="ml-1">Screen reader support, keyboard navigation, high contrast modes, and other accessibility tools.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Analytics & Reporting:</span>
              <span className="ml-1">Comprehensive analytics, result visualization, and export capabilities for voting data.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Integration & API:</span>
              <span className="ml-1">API access and integration tools for enterprise users and third-party applications.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Support & Documentation:</span>
              <span className="ml-1">Comprehensive documentation, tutorials, and customer support for all users.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <Cog6ToothIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Service Availability:</span>
            </span>
            <span>
              We strive to maintain 99.9% uptime but may occasionally need to perform maintenance or updates. We will provide advance notice for scheduled maintenance.
            </span>
          </div>
        </section>

        {/* User Conduct */}
        <section id="user-conduct" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-400" />
            User Conduct & Responsibilities
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              To maintain a secure, fair, and accessible voting environment, all users must follow these conduct guidelines and responsibilities.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Accurate Information:</span>
              <span className="ml-1">Provide accurate, complete, and current information when creating your account and using our services.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">One Vote Per Person:</span>
              <span className="ml-1">Do not attempt to vote multiple times in the same poll or create multiple accounts to circumvent voting limits.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Respectful Behavior:</span>
              <span className="ml-1">Treat other users with respect. Do not harass, threaten, or discriminate against others.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">No Misuse:</span>
              <span className="ml-1">Do not use our services for illegal activities, fraud, or to interfere with legitimate voting processes.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Security:</span>
              <span className="ml-1">Protect your account credentials and report any suspicious activity immediately.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Compliance:</span>
              <span className="ml-1">Follow all applicable laws, regulations, and platform rules when using our services.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Accessibility:</span>
              <span className="ml-1">Do not intentionally interfere with accessibility features or create content that excludes users with disabilities.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <UserIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Violations:</span>
            </span>
            <span>
              Violation of these conduct rules may result in account suspension, termination, or legal action as appropriate.
            </span>
          </div>
        </section>

        {/* Intellectual Property */}
        <section id="intellectual-property" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-400" />
            Intellectual Property Rights
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              This section outlines the intellectual property rights and licensing terms for content and services on the Votely platform.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Votely Platform:</span>
              <span className="ml-1">The Votely platform, including software, design, and branding, is owned by Votely and protected by intellectual property laws.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">User Content:</span>
              <span className="ml-1">You retain ownership of content you create (polls, comments, etc.) while granting Votely a license to use it for service provision.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">License Grant:</span>
              <span className="ml-1">By posting content, you grant Votely a worldwide, non-exclusive license to use, display, and distribute your content for platform functionality.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Third-Party Content:</span>
              <span className="ml-1">Respect third-party intellectual property rights. Do not post content that infringes on others' rights.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Trademarks:</span>
              <span className="ml-1">Votely trademarks and logos may not be used without written permission.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Open Source:</span>
              <span className="ml-1">Some components of our platform may use open-source software, subject to their respective licenses.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <DocumentTextIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Infringement Claims:</span>
            </span>
            <span>
              If you believe your intellectual property rights have been violated, please contact us at <a href="mailto:legal@votely.com" className="text-blue-700 dark:text-blue-400 underline">legal@votely.com</a>.
            </span>
          </div>
        </section>

        {/* Privacy & Security */}
        <section id="privacy-security" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
            Privacy & Security
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We are committed to protecting your privacy and maintaining the security of our platform. Our privacy practices are detailed in our Privacy Policy.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Data Protection:</span>
              <span className="ml-1">We implement industry-standard security measures to protect your personal information and voting data.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Encryption:</span>
              <span className="ml-1">All sensitive data is encrypted in transit and at rest using strong encryption protocols.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Access Controls:</span>
              <span className="ml-1">Strict access controls and authentication measures protect your account and voting integrity.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Compliance:</span>
              <span className="ml-1">We comply with applicable privacy laws and regulations, including GDPR, CCPA, and accessibility standards.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Breach Notification:</span>
              <span className="ml-1">In the event of a security breach, we will notify affected users in accordance with legal requirements.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Your Responsibilities:</span>
              <span className="ml-1">You are responsible for maintaining the security of your account credentials and reporting suspicious activity.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Privacy Policy:</span>
            </span>
            <span>
              For detailed information about our privacy practices, please review our <a href="/privacy-policy" className="text-blue-700 dark:text-blue-400 underline">Privacy Policy</a>.
            </span>
          </div>
        </section>

        {/* Liability */}
        <section id="liability" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ScaleIcon className="w-5 h-5 text-blue-400" />
            Limitation of Liability
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              This section outlines the limitations on Votely's liability and your responsibilities when using our services.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Service Availability:</span>
              <span className="ml-1">While we strive for high availability, we do not guarantee uninterrupted service and are not liable for temporary outages.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Data Loss:</span>
              <span className="ml-1">We implement backup and recovery procedures, but we are not liable for data loss due to circumstances beyond our control.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">User Content:</span>
              <span className="ml-1">We are not responsible for content created by users or third parties on our platform.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Third-Party Services:</span>
              <span className="ml-1">We are not liable for issues arising from third-party services, integrations, or external websites.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Limitation of Damages:</span>
              <span className="ml-1">Our liability is limited to the amount you paid for our services in the 12 months preceding the claim.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Exclusions:</span>
              <span className="ml-1">We are not liable for indirect, incidental, consequential, or punitive damages.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <ScaleIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Legal Jurisdiction:</span>
            </span>
            <span>
              These limitations apply to the maximum extent permitted by applicable law. Some jurisdictions may not allow certain limitations.
            </span>
          </div>
        </section>

        {/* Termination */}
        <section id="termination" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-400" />
            Account Termination
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              This section explains the conditions under which accounts may be terminated and the consequences of termination.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">User-Initiated Termination:</span>
              <span className="ml-1">You may terminate your account at any time through your profile settings or by contacting support.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Violation of Terms:</span>
              <span className="ml-1">We may suspend or terminate accounts that violate these terms, with or without notice depending on the severity.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Fraud or Abuse:</span>
              <span className="ml-1">Accounts involved in fraud, abuse, or illegal activities will be terminated immediately.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Inactivity:</span>
              <span className="ml-1">Accounts inactive for extended periods may be suspended or terminated after reasonable notice.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Data Retention:</span>
              <span className="ml-1">Upon termination, we will delete your personal data in accordance with our Privacy Policy and legal obligations.</span>
            </li>
            <li>
              <span className="font-medium text-blue-700 dark:text-blue-300">Surviving Provisions:</span>
              <span className="ml-1">Certain provisions of these terms survive termination, including intellectual property and liability limitations.</span>
            </li>
          </ul>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-blue-400 mr-1" aria-hidden="true" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Appeal Process:</span>
            </span>
            <span>
              If you believe your account was terminated in error, you may appeal by contacting <a href="mailto:support@votely.com" className="text-blue-700 dark:text-blue-400 underline">support@votely.com</a>.
            </span>
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
              If you have questions about these terms or need assistance with our services, please reach out to our support team.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">General Support:</span>
                <span className="ml-1">Email us at <a href="mailto:support@votely.com" className="text-blue-700 dark:text-blue-400 underline">support@votely.com</a> for technical issues or general inquiries.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Legal Questions:</span>
                <span className="ml-1">For legal matters or terms-related questions, contact <a href="mailto:legal@votely.com" className="text-blue-700 dark:text-blue-400 underline">legal@votely.com</a>.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Privacy Concerns:</span>
                <span className="ml-1">For privacy-related questions, contact <a href="mailto:privacy@votely.com" className="text-blue-700 dark:text-blue-400 underline">privacy@votely.com</a>.</span>
              </li>
              <li>
                <span className="font-medium text-blue-700 dark:text-blue-300">Accessibility Support:</span>
                <span className="ml-1">For accessibility issues or feedback, contact <a href="mailto:accessibility@votely.com" className="text-blue-700 dark:text-blue-400 underline">accessibility@votely.com</a>.</span>
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
                href="/terms-of-service"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Terms of Service
              </a>
              <span className="mx-1">|</span>
              <a
                href="/privacy-policy"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Privacy Policy
              </a>
              <span className="mx-1">|</span>
              <a
                href="mailto:legal@votely.com"
                className="underline hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                Contact Legal Team
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