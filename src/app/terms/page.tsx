'use client'

import { motion } from 'framer-motion'
import AppNavigation from '@/components/layout/AppNavigation'
import './page.scss'

export default function TermsOfService() {
  return (
    <div className="terms-page">
      <AppNavigation currentPage="Terms of Service" />
      
      <main className="terms-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="terms-content"
        >
          <div className="terms-header">
            <h1 className="terms-title">Terms of Service</h1>
            <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="terms-body">
            <section className="terms-section">
              <h2 className="terms-section-title">1. Acceptance of Terms</h2>
              <p className="terms-text">
                By accessing and using Crittr (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">2. Description of Service</h2>
              <p className="terms-text">
                Crittr is a pet health tracking application that allows users to monitor their pets&apos; health, log activities, set reminders, and maintain health records. The service is provided &quot;as is&quot; and we make no warranties regarding its availability or functionality.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">3. User Accounts</h2>
              <p className="terms-text">
                To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">4. User Responsibilities</h2>
              <p className="terms-text">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for:
              </p>
              <ul className="terms-list">
                <li>Providing accurate and complete information about your pets</li>
                <li>Using the Service in compliance with applicable laws</li>
                <li>Not sharing your account credentials with others</li>
                <li>Not using the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">5. Data and Privacy</h2>
              <p className="terms-text">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">6. Medical Disclaimer & Limitation of Liability</h2>
              <div className="terms-warning-box">
                <p className="terms-warning-text">
                  <strong>IMPORTANT MEDICAL DISCLAIMER:</strong> Crittr is NOT a veterinary service, and we are NOT licensed veterinarians. We do NOT provide medical advice, diagnosis, or treatment for animals.
                </p>
              </div>
              <p className="terms-text">
                The information provided through the Service is for informational and tracking purposes only and should NEVER be considered as professional veterinary advice, diagnosis, or treatment recommendations.
              </p>
              <p className="terms-text">
                <strong>You acknowledge and agree that:</strong>
              </p>
              <ul className="terms-list">
                <li>Crittr is NOT a substitute for professional veterinary care</li>
                <li>We are NOT responsible for the health, safety, or wellbeing of your pets</li>
                <li>You must ALWAYS consult with a qualified, licensed veterinarian for any medical decisions regarding your pets</li>
                <li>We do NOT guarantee the accuracy, completeness, or usefulness of any information provided</li>
                <li>Use of this service is at your own risk and discretion</li>
              </ul>
              <p className="terms-text">
                <strong>In case of emergency:</strong> If you believe your pet has a medical emergency, contact your veterinarian or an emergency veterinary clinic immediately. Do not rely on this application for emergency medical decisions.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">7. Termination</h2>
              <p className="terms-text">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">8. Changes to Terms</h2>
              <p className="terms-text">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="terms-section-title">9. Contact Information</h2>
              <p className="terms-text">
                If you have any questions about these Terms of Service, please contact us at support@crittr.com
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
