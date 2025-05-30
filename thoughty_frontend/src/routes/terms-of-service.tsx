import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faCalendar, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={faGavel} className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. By accessing Thoughty, you agree to be bound by these terms.
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  By accessing and using Thoughty ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-300">
                  These Terms of Service ("Terms") govern your use of our platform and services. We reserve the right to update these terms at any time without prior notice.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Thoughty is a gamified thought development platform designed for entrepreneurs and creators. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Thought pod creation and management</li>
                  <li>Brainstorming tools and sessions</li>
                  <li>Idea battles and competitions</li>
                  <li>AI-powered mentoring and guidance</li>
                  <li>Community features and collaboration tools</li>
                  <li>Gamification elements and progress tracking</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Account Creation</h3>
                <p className="text-gray-300 mb-4">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Account Termination</h3>
                <p className="text-gray-300">
                  We reserve the right to suspend or terminate your account at any time for violations of these terms or other reasonable grounds.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. User Content and Conduct</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Content Ownership</h3>
                <p className="text-gray-300 mb-4">
                  You retain ownership of all content you create on our platform. However, by posting content, you grant us a non-exclusive, 
                  worldwide license to use, display, and distribute your content for platform operations.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Prohibited Conduct</h3>
                <p className="text-gray-300 mb-4">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Post illegal, harmful, or offensive content</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Spam or engage in unsolicited advertising</li>
                  <li>Attempt to hack or compromise platform security</li>
                  <li>Violate intellectual property rights</li>
                  <li>Impersonate others or provide false information</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  The Thoughty platform, including its design, features, and functionality, is owned by us and protected by intellectual property laws. 
                  You may not copy, modify, or distribute our platform without permission.
                </p>
                <p className="text-gray-300">
                  All trademarks, logos, and brand names displayed on the platform are our property or used with permission.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Protection</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Your privacy is important to us. Our data collection and use practices are governed by our Privacy Policy, 
                  which is incorporated into these terms by reference.
                </p>
                <p className="text-gray-300">
                  By using our platform, you consent to the collection and use of your information as outlined in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Our platform is provided "as is" and "as available" without warranties of any kind, either express or implied. 
                  We do not warrant that:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>The service will be uninterrupted or error-free</li>
                  <li>All information provided is accurate or complete</li>
                  <li>The platform will meet your specific requirements</li>
                  <li>Any defects will be corrected</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising from your use of the platform.
                </p>
                <p className="text-gray-300">
                  Our total liability to you for any damages shall not exceed the amount you paid us in the twelve months preceding the claim.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses arising from 
                  your use of the platform, violation of these terms, or infringement of any rights of another party.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  These terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
                  without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Jurisdiction].
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes 
                  by posting the updated terms on this page and updating the "Last updated" date. Continued use of the platform 
                  after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="flex items-center text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-500" />
                  <a href="mailto:legal@thoughty.com" className="text-purple-400 hover:text-purple-600 font-medium">
                    legal@thoughty.com
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