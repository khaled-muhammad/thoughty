import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faCalendar, faEnvelope, faToggleOn } from '@fortawesome/free-solid-svg-icons';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={faCookie} className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience on our platform.
          </p>
          <div className="flex items-center justify-center mt-6 text-sm text-gray-400">
            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
            <span>Last updated: January 15, 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
                </p>
                <p className="text-gray-300">
                  Cookies do not contain any personally identifiable information and cannot harm your device. 
                  They are widely used across the internet to make websites work more efficiently.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>
              <div className="prose prose-invert max-w-none">
                
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Essential Cookies</h3>
                <div className="bg-blue-900 border-l-4 border-blue-400 p-4 mb-6">
                  <p className="text-gray-300 mb-2">
                    <strong>Purpose:</strong> These cookies are necessary for the website to function properly.
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong>Examples:</strong> Authentication, security, form submissions
                  </p>
                  <p className="text-gray-300">
                    <strong>Control:</strong> Cannot be disabled as they are essential for site functionality
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-200 mb-3">Analytics Cookies</h3>
                <div className="bg-green-900 border-l-4 border-green-400 p-4 mb-6">
                  <p className="text-gray-300 mb-2">
                    <strong>Purpose:</strong> Help us understand how visitors interact with our website
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong>Examples:</strong> Google Analytics, page views, session duration
                  </p>
                  <p className="text-gray-300">
                    <strong>Control:</strong> Can be disabled through browser settings or our cookie preferences
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-200 mb-3">Functional Cookies</h3>
                <div className="bg-purple-900 border-l-4 border-purple-400 p-4 mb-6">
                  <p className="text-gray-300 mb-2">
                    <strong>Purpose:</strong> Remember your preferences and provide enhanced features
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong>Examples:</strong> Language preferences, theme settings, saved filters
                  </p>
                  <p className="text-gray-300">
                    <strong>Control:</strong> Can be disabled, but may affect site functionality
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-200 mb-3">Advertising Cookies</h3>
                <div className="bg-orange-900 border-l-4 border-orange-400 p-4 mb-6">
                  <p className="text-gray-300 mb-2">
                    <strong>Purpose:</strong> Deliver relevant advertisements and measure campaign effectiveness
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong>Examples:</strong> Ad targeting, conversion tracking, remarketing
                  </p>
                  <p className="text-gray-300">
                    <strong>Control:</strong> Can be disabled through cookie preferences or browser settings
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Cookies</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Authentication:</strong> Keep you logged in during your session</li>
                  <li><strong>Preferences:</strong> Remember your settings and customizations</li>
                  <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Analytics:</strong> Understand user behavior and improve our platform</li>
                  <li><strong>Performance:</strong> Load pages faster and provide better functionality</li>
                  <li><strong>Personalization:</strong> Customize content based on your interests</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  We may use third-party services that place cookies on your device. These include:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Google Analytics</h4>
                    <p className="text-gray-300 text-sm">
                      Provides insights into website usage and user behavior to help us improve our platform.
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Social Media Plugins</h4>
                    <p className="text-gray-300 text-sm">
                      Enable social sharing and may track your interactions with social content.
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Content Delivery Networks</h4>
                    <p className="text-gray-300 text-sm">
                      Help deliver website content faster and more reliably.
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Customer Support Tools</h4>
                    <p className="text-gray-300 text-sm">
                      Enable chat functionality and help us provide better customer service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Managing Your Cookie Preferences</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Browser Settings</h3>
                <p className="text-gray-300 mb-4">
                  You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-200 mb-3">Cookie Preference Center</h3>
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center mb-4">
                    <FontAwesomeIcon icon={faToggleOn} className="text-2xl mr-3" />
                    <h4 className="text-lg font-semibold">Manage Cookie Preferences</h4>
                  </div>
                  <p className="mb-4">
                    Click below to open our cookie preference center where you can customize your cookie settings.
                  </p>
                  <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Cookie Settings
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-200 mb-3">Opt-Out Tools</h3>
                <p className="text-gray-300 mb-4">
                  You can also use these industry tools to opt out of advertising cookies:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Digital Advertising Alliance: <a href="http://optout.aboutads.info/" className="text-orange-400 hover:text-orange-600">optout.aboutads.info</a></li>
                  <li>Network Advertising Initiative: <a href="http://optout.networkadvertising.org/" className="text-orange-400 hover:text-orange-600">optout.networkadvertising.org</a></li>
                  <li>European Interactive Digital Advertising Alliance: <a href="http://youronlinechoices.eu/" className="text-orange-400 hover:text-orange-600">youronlinechoices.eu</a></li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Impact of Disabling Cookies</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Disabling certain cookies may affect your experience on our platform:
                </p>
                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>You may need to log in repeatedly</li>
                    <li>Your preferences and settings may not be saved</li>
                    <li>Some features may not work properly</li>
                    <li>Content may not be personalized to your interests</li>
                    <li>We may not be able to remember your cookie preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. 
                  We will notify you of any significant changes by posting the updated policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="flex items-center text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-orange-500" />
                  <a href="mailto:cookies@thoughty.com" className="text-orange-400 hover:text-orange-600 font-medium">
                    cookies@thoughty.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 