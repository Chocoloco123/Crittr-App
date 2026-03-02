'use client'

import { motion } from 'framer-motion'
import AppNavigation from '@/components/layout/AppNavigation'
import './page.scss'

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <AppNavigation currentPage="Privacy Policy" />
      
      <main className="privacy-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="privacy-content"
        >
          <div className="privacy-header">
            <h1 className="privacy-title">Privacy Policy</h1>
            <p className="privacy-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="privacy-body">
            <section className="privacy-section">
              <h2 className="privacy-section-title">1. Information We Collect</h2>
              <p className="privacy-text">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
              
              <h3 className="privacy-subsection-title">Personal Information</h3>
              <ul className="privacy-list">
                <li><strong>Google Account Information:</strong> When you sign in with Google, we collect your name, email address, and profile picture</li>
                <li><strong>Pet Information:</strong> Information about your pets including names, species, breeds, health records, and photos</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including features accessed and time spent</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">2. How We Use Your Information</h2>
              <p className="privacy-text">
                We use the information we collect to:
              </p>
              <ul className="privacy-list">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
              
              <div className="privacy-warning-box">
                <p className="privacy-warning-text">
                  <strong>IMPORTANT:</strong> We do NOT use your pet&apos;s health information to provide medical advice, diagnosis, or treatment. We are NOT veterinarians and do NOT offer veterinary services.
                </p>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">3. Information Sharing</h2>
              <p className="privacy-text">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="privacy-list">
                <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our service</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">4. Data Security</h2>
              <p className="privacy-text">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">5. Data Retention</h2>
              <p className="privacy-text">
                We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">6. Your Rights</h2>
              <p className="privacy-text">
                You have the right to:
              </p>
              <ul className="privacy-list">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of certain communications</li>
                <li>Request a copy of your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">7. Cookies and Tracking</h2>
              <p className="privacy-text">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">8. Third-Party Services</h2>
              <p className="privacy-text">
                Our service integrates with Google for authentication. Please review Google&apos;s Privacy Policy to understand how they handle your information.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">9. Children&apos;s Privacy</h2>
              <p className="privacy-text">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">10. Changes to This Policy</h2>
              <p className="privacy-text">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-title">11. Contact Us</h2>
              <p className="privacy-text">
                If you have any questions about this Privacy Policy, please contact us at privacy@crittr.com
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
