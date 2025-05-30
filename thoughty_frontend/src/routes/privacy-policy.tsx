import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faCalendar, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={faShield} className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Personal Information</h3>
                <p className="text-gray-300 mb-4">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Username and password</li>
                  <li>Profile information you choose to provide</li>
                  <li>Content you create, including thought pods and brainstorm sessions</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Usage Information</h3>
                <p className="text-gray-300 mb-4">
                  We automatically collect information about how you use our platform:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Pages visited and features used</li>
                  <li>Time spent on the platform</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">We use your information to:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Personalize your experience</li>
                  <li>Communicate with you about updates and features</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Analyze usage patterns to enhance functionality</li>
                  <li>Provide customer support</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                  <li>In connection with a business merger or acquisition</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Restrict processing of your information</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  We use cookies and similar technologies to enhance your experience. These help us:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="flex items-center text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-indigo-500" />
                  <a href="mailto:privacy@thoughty.com" className="text-indigo-400 hover:text-indigo-600 font-medium">
                    privacy@thoughty.com
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