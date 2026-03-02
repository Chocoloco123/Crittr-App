'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Twitter, Facebook, Instagram, Github } from 'lucide-react'
import Image from 'next/image'
import './Footer.scss'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'FAQ', href: '/faq' },
      { name: 'About', href: '/about' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' }
  ]

  return (
    <footer className="footer">
      {/* Subtle background decoration */}
      <div className="footer-decoration">
        <div className="paw-decoration">🐾</div>
        <div className="heart-decoration">💕</div>
      </div>
      
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section - Takes up 2 columns */}
          <div className="footer-brand">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="footer-logo">
                <h3 className="logo-title">
                  🐾 Crittr
                </h3>
                <p className="logo-description">
                  Pet health & journaling. Monitor your pet&apos;s health, track daily activities, and maintain detailed records for better veterinary care.
                </p>
              </div>

              {/* Tagline */}
              <div className="footer-tagline">
                <div className="tagline-text">
                  Made with love for pet parents!
                  <div className="tagline-heart">
                    <Image 
                      src="/images/icons/heart-red.png" 
                      alt="Love" 
                      fill 
                      sizes="24px"
                      className="object-contain" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="footer-newsletter">
                <h4 className="newsletter-title">Stay Updated</h4>
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <button className="newsletter-button">
                    Subscribe
                    <ArrowRight className="button-icon" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="social-link"
                  >
                    <social.icon className="social-icon" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections - Grouped together */}
          <div className="footer-links">
            <div className="links-grid">
              {/* Product Section */}
              <div className="links-section">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="section-title">Product</h4>
                  <ul className="links-list">
                    {footerLinks.product.map((link, index) => (
                      <li key={index} className="link-item">
                        <a href={link.href} className="link">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Support Section */}
              <div className="links-section">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 className="section-title">Support</h4>
                  <ul className="links-list">
                    {footerLinks.support.map((link, index) => (
                      <li key={index} className="link-item">
                        <a href={link.href} className="link">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Legal Section */}
              <div className="links-section">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h4 className="section-title">Legal</h4>
                  <ul className="links-list">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index} className="link-item">
                        <a href={link.href} className="link">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="footer-disclaimer"
        >
          <div className="disclaimer-content">
            <p className="disclaimer-text">
              <strong>Disclaimer:</strong> Crittr is not a licensed veterinary service. AI insights are for informational purposes only. 
              Always consult a licensed veterinarian for medical advice. We are not liable for health decisions 
              made based on our platform&apos;s information.
            </p>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="footer-bottom"
        >
          <div className="bottom-content">
            <div className="made-with-love">
              <span>Made with</span>
              <div className="love-heart">
                <Image 
                  src="/images/icons/heart-pink.png" 
                  alt="Heart" 
                  fill 
                  sizes="20px"
                  className="object-contain" 
                />
              </div>
              <span>for pet lovers worldwide</span>
            </div>
            
            <div className="copyright">
              © {currentYear} <span className="brand-name">Crittr</span>. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
