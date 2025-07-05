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
  UserIcon,
  HeartIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const sections = [
  { id: 'summary', label: 'Summary', icon: GlobeAltIcon },
  { id: 'commitment', label: 'Our Commitment', icon: HeartIcon },
  { id: 'standards', label: 'Accessibility Standards', icon: ShieldCheckIcon },
  { id: 'features', label: 'Accessibility Features', icon: Cog6ToothIcon },
  { id: 'compatibility', label: 'Compatibility', icon: WrenchScrewdriverIcon },
  { id: 'feedback', label: 'Feedback & Support', icon: UserIcon },
  { id: 'improvements', label: 'Continuous Improvement', icon: EyeSlashIcon },
  { id: 'contact', label: 'Contact', icon: LockClosedIcon },
];

export default function AccessibilityStatement() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto rounded-2xl animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400/30 dark:bg-blue-500/20 opacity-70"></span>
              <HeartIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 drop-shadow-lg" aria-hidden="true" />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight flex items-center gap-2">
              Accessibility Statement
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
            Votely is committed to ensuring digital accessibility for people with disabilities. We believe that democratic participation should be accessible to everyone, regardless of ability.
          </p>
        </header>

        {/* Enhanced Quick Nav */}
        <nav
          aria-label="Accessibility Statement Sections"
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
          aria-labelledby="accessibility-summary-heading"
        >
          <div className="absolute -top-4 -left-4 w-32 h-16 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="accessibility-summary-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            Summary
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-2 z-10 relative">
            <p className="mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Votely</span> is committed to making democratic participation accessible to everyone. Our platform is designed and developed with accessibility as a core principle, not an afterthought.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">WCAG 2.1 AA Compliance:</span> Our platform meets or exceeds Web Content Accessibility Guidelines 2.1 Level AA standards.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Section 508 Compliance:</span> We comply with Section 508 of the Rehabilitation Act for federal accessibility requirements.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Universal Design:</span> Our platform is designed to be usable by people with diverse abilities and needs.
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Continuous Improvement:</span> We regularly test, evaluate, and improve our accessibility features based on user feedback.
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <HeartIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                Questions or feedback? See <a href="#contact" className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-200 transition">Contact</a> below.
              </span>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section id="commitment" className="mb-10 relative" aria-labelledby="commitment-heading">
          <div className="absolute -top-4 -left-4 w-28 h-14 rounded-full blur-2xl pointer-events-none z-0 bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-indigo-200/10 dark:from-blue-700/30 dark:via-blue-500/20 dark:to-purple-700/10 animate-pulse" aria-hidden="true" />
          <h2
            id="commitment-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 z-10"
          >
            <HeartIcon className="w-5 h-5 text-blue-400" />
            Our Commitment to Accessibility
          </h2>
          <div className="text-gray-700 dark:text-gray-300 z-10 relative">
            <p className="mb-2">
              At Votely, we believe that democratic participation is a fundamental right that should be accessible to everyone, regardless of their abilities or disabilities. Our commitment to accessibility is woven into every aspect of our platform.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Inclusive Design:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  We follow universal design principles, ensuring our platform works for users with diverse abilities, including those with visual, auditory, motor, and cognitive disabilities.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">User-Centered Development:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  We involve users with disabilities in our design and testing processes to ensure our solutions meet real-world needs.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Continuous Testing:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  We regularly test our platform with assistive technologies and conduct accessibility audits to maintain high standards.
                </span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Training & Awareness:</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  Our development team receives regular training on accessibility best practices and standards.
                </span>
              </li>
            </ul>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Our Promise:</strong> We are committed to making Votely accessible to everyone. If you encounter any accessibility barriers, we want to hear from you and will work to resolve them promptly.
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Standards */}
        <section id="standards" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
            Accessibility Standards & Compliance
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Votely adheres to internationally recognized accessibility standards and guidelines to ensure our platform is accessible to users with diverse abilities.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                WCAG 2.1 AA Compliance
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-2">
                Our platform meets or exceeds Web Content Accessibility Guidelines 2.1 Level AA standards, which are internationally recognized accessibility guidelines.
              </p>
              <ul className="list-disc pl-6 text-green-700 dark:text-green-300 space-y-1">
                <li>Perceivable: Content is presented in ways that users can perceive</li>
                <li>Operable: Interface components are operable through various input methods</li>
                <li>Understandable: Information and operation of the interface are understandable</li>
                <li>Robust: Content can be interpreted reliably by assistive technologies</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Section 508 Compliance
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-2">
                We comply with Section 508 of the Rehabilitation Act, which requires federal agencies to make their electronic and information technology accessible to people with disabilities.
              </p>
              <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 space-y-1">
                <li>Software applications and operating systems accessibility</li>
                <li>Web-based intranet and internet information and applications</li>
                <li>Telecommunications products accessibility</li>
                <li>Video and multimedia products accessibility</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Additional Standards
              </h3>
              <p className="text-purple-700 dark:text-purple-300 mb-2">
                Beyond WCAG and Section 508, we also consider other accessibility standards and best practices.
              </p>
              <ul className="list-disc pl-6 text-purple-700 dark:text-purple-300 space-y-1">
                <li>EN 301 549 (European accessibility standard)</li>
                <li>ISO/IEC 40500 (International standard based on WCAG 2.0)</li>
                <li>ADA Title III compliance considerations</li>
                <li>Industry best practices for voting system accessibility</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section id="features" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-blue-400" />
            Accessibility Features
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Votely includes a comprehensive range of accessibility features designed to support users with diverse abilities and needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <EyeSlashIcon className="w-5 h-5 text-blue-400" />
                  Visual Accessibility
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>High contrast mode and customizable color schemes</li>
                  <li>Screen reader compatibility (NVDA, JAWS, VoiceOver, TalkBack)</li>
                  <li>Text resizing up to 200% without loss of functionality</li>
                  <li>Alternative text for all images and graphics</li>
                  <li>Keyboard navigation support</li>
                  <li>Focus indicators and visible focus management</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Cog6ToothIcon className="w-5 h-5 text-blue-400" />
                  Motor & Physical Accessibility
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Full keyboard navigation and shortcuts</li>
                  <li>Voice control compatibility</li>
                  <li>Large click targets and touch-friendly interfaces</li>
                  <li>Customizable timing for time-sensitive actions</li>
                  <li>Switch device compatibility</li>
                  <li>Reduced motion options for users with vestibular disorders</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-400" />
                  Cognitive & Learning Accessibility
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Clear, simple language and consistent navigation</li>
                  <li>Logical content structure and headings</li>
                  <li>Error prevention and clear error messages</li>
                  <li>Progress indicators and confirmation steps</li>
                  <li>Customizable interface complexity</li>
                  <li>Help text and contextual assistance</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                  Auditory Accessibility
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Captions and transcripts for multimedia content</li>
                  <li>Visual alternatives to audio notifications</li>
                  <li>Text-based communication options</li>
                  <li>Volume control and audio customization</li>
                  <li>Visual alerts and notifications</li>
                  <li>Sign language interpretation support where applicable</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compatibility */}
        <section id="compatibility" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-blue-400" />
            Assistive Technology Compatibility
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Votely is designed to work seamlessly with a wide range of assistive technologies and devices commonly used by people with disabilities.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Screen Readers:</span>
              <span className="ml-1">JAWS, NVDA, VoiceOver (macOS/iOS), TalkBack (Android), Narrator (Windows)</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Voice Recognition:</span>
              <span className="ml-1">Dragon NaturallySpeaking, Windows Speech Recognition, Voice Control (macOS)</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Switch Devices:</span>
              <span className="ml-1">Compatible with various switch access devices and software</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Magnification Software:</span>
              <span className="ml-1">ZoomText, Windows Magnifier, macOS Zoom</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Browser Compatibility:</span>
              <span className="ml-1">Chrome, Firefox, Safari, Edge with accessibility features enabled</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Mobile Accessibility:</span>
              <span className="ml-1">iOS and Android accessibility features fully supported</span>
            </li>
          </ul>
        </section>

        {/* Feedback */}
        <section id="feedback" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-400" />
            Feedback & Support
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              We welcome feedback from users with disabilities and are committed to addressing accessibility issues promptly. Your input helps us improve our platform for everyone.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Accessibility Issues:</span>
              <span className="ml-1">Report any accessibility barriers you encounter while using our platform.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Feature Requests:</span>
              <span className="ml-1">Suggest accessibility features or improvements that would benefit you.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Testing Participation:</span>
              <span className="ml-1">Volunteer to participate in accessibility testing and user research.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Documentation:</span>
              <span className="ml-1">Request accessible documentation or alternative formats.</span>
            </li>
          </ul>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              How to Provide Feedback
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Email</h4>
                <p className="text-blue-700 dark:text-blue-300">accessibility@votely.com</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Support Form</h4>
                <p className="text-blue-700 dark:text-blue-300">Accessible contact form on our website</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Phone</h4>
                <p className="text-blue-700 dark:text-blue-300">1-800-VOTELY (accessible phone support)</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 dark:text-blue-300 mb-1">Response Time</h4>
                <p className="text-blue-700 dark:text-blue-300">We aim to respond within 2 business days</p>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Improvement */}
        <section id="improvements" className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <EyeSlashIcon className="w-5 h-5 text-blue-400" />
            Continuous Improvement
          </h2>
          <div className="text-gray-700 dark:text-gray-300 mb-3">
            <p>
              Accessibility is an ongoing commitment. We continuously work to improve our platform's accessibility through regular testing, user feedback, and staying current with best practices.
            </p>
          </div>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Regular Audits:</span>
              <span className="ml-1">We conduct quarterly accessibility audits using automated tools and manual testing.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">User Testing:</span>
              <span className="ml-1">We regularly test our platform with users who have disabilities to identify and address accessibility issues.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Training:</span>
              <span className="ml-1">Our development team receives ongoing training on accessibility standards and best practices.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Standards Updates:</span>
              <span className="ml-1">We monitor updates to accessibility standards and guidelines to ensure continued compliance.</span>
            </li>
            <li>
              <span className="font-medium text-blue-600 dark:text-blue-300">Technology Advances:</span>
              <span className="ml-1">We stay current with advances in assistive technology and incorporate new accessibility features as they become available.</span>
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
              We're here to help ensure that Votely is accessible to everyone. If you have questions, need assistance, or want to provide feedback about accessibility, please reach out.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Accessibility Team:</span>
                <span className="ml-1">Email us at <a href="mailto:accessibility@votely.com" className="text-blue-600 dark:text-blue-400 underline">accessibility@votely.com</a> for accessibility-specific questions and feedback.</span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">General Support:</span>
                <span className="ml-1">For general technical support, contact <a href="mailto:support@votely.com" className="text-blue-600 dark:text-blue-400 underline">support@votely.com</a>.</span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Phone Support:</span>
                <span className="ml-1">Call 1-800-VOTELY for accessible phone support during business hours.</span>
              </li>
              <li>
                <span className="font-medium text-blue-600 dark:text-blue-300">Documentation:</span>
                <span className="ml-1">Request accessible documentation or alternative formats for any materials.</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <InformationCircleIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                We aim to respond to all accessibility inquiries within 2 business days. For urgent matters, please indicate "URGENT" in your email subject.
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
                href="/accessibility"
                className="underline hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Accessibility Statement
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