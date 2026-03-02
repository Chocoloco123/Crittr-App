'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import './AboutSection.scss'

export default function AboutSection() {
  const stats = [
    { icon: '/images/icons/dog.png', number: '50K+', label: 'Happy Pet Parents' },
    { icon: '/images/icons/guineapig.png', number: '100K+', label: 'Pets Tracked' },
    { icon: '/images/icons/heart-red.png', number: '4.9/5', label: 'App Store Rating' },
    { icon: '/images/icons/pawIcon.png', number: '99.9%', label: 'Uptime Guarantee' }
  ]

  const teamValues = [
    {
      title: 'Pet-First Design',
      description: 'Every feature is designed with your pet\'s wellbeing in mind. We understand the unique bond between pets and their families.',
      icon: '/images/icons/pawIcon.png'
    },
    {
      title: 'AI-Powered Insights',
      description: 'Our advanced AI technology provides intelligent health insights and recommendations to help you better understand your pet\'s wellbeing.',
      icon: '/images/icons/stethescope.png'
    },
    {
      title: 'Privacy & Security',
      description: 'Your pet\'s data is encrypted and secure. We never share your information without your explicit consent.',
      icon: '/images/icons/robot.png'
    },
    {
      title: 'Community Driven',
      description: 'Built by pet parents, for pet parents. We listen to our community and continuously improve based on your feedback.',
      icon: '/images/icons/heart-pink.png'
    }
  ]

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="about-header"
        >
          <h2 className="about-title">
            About Crittr
          </h2>
          <p className="about-description">
            We're passionate pet parents who believe every pet deserves the best care. 
            Crittr was born from our own struggles to keep track of our pets' health, 
            appointments, and precious memories.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="about-stats"
        >
          {stats.map((stat, index) => (
            <div key={index} className="about-stat">
              <div className="about-stat-icon">
                <Image 
                  src={stat.icon} 
                  alt={stat.label}
                  width={48}
                  height={48}
                  className="object-contain" 
                />
              </div>
              <div className="about-stat-number">
                {stat.number}
              </div>
              <div className="about-stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="about-story"
        >
          <h3 className="about-story-title">
            Our Story
          </h3>
          
          {/* Mobile/Tablet Image - appears below heading */}
          <div className="about-story-image-mobile">
            <div className="about-story-image">
              <Image 
                src="/images/icons/goldenretriever.png" 
                alt="Teddy the Golden Retriever" 
                width={320}
                height={320}
                className="object-contain bg-gradient-to-br from-teal-100 to-orange-100" 
              />
            </div>
          </div>

          <div className="about-story-grid">
            <div className="about-story-content">
              <div className="about-story-text">
                <p className="about-story-paragraph">
                  It started with Teddy, my golden retriever. Between vet appointments, 
                  medication schedules, and wanting to capture every adorable moment, I was drowning in sticky notes and scattered photos.
                </p>
                <p className="about-story-paragraph">
                  I knew there had to be a better way. So I built Crittr - a comprehensive 
                  platform that combines health tracking, memory keeping, and AI-powered 
                  insights to help pet parents like me give our furry family members the 
                  best care possible.
                </p>
                <p className="about-story-paragraph">
                  Today, Crittr helps thousands of pet parents stay organized, informed, 
                  and connected to their pets' wellbeing. Because every pet deserves to 
                  live their healthiest, happiest life.
                </p>
              </div>
            </div>
            <div className="about-story-image-container">
              <div className="about-story-image">
                <Image 
                  src="/images/icons/goldenretriever.png" 
                  alt="Teddy the Golden Retriever" 
                  width={320}
                  height={320}
                  className="object-contain bg-gradient-to-br from-teal-100 to-orange-100" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="about-values-title">
            Our Values
          </h3>
          <div className="about-values-grid">
            {teamValues.map((value, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-content">
                  <div className="about-value-icon">
                    <Image 
                      src={value.icon} 
                      alt={value.title}
                      width={48}
                      height={48}
                      className="object-contain" 
                    />
                  </div>
                  <div className="about-value-text">
                    <h4 className="about-value-title">
                      {value.title}
                    </h4>
                    <p className="about-value-description">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="about-cta"
        >
          <h3 className="about-cta-title">
            Join Our Pet Parent Community
          </h3>
          <p className="about-cta-description">
            Ready to give your pets the care they deserve? Start your free trial today 
            and join thousands of happy pet parents who trust Crittr.
          </p>
          <button className="about-cta-button">
            Start Your Free Trial
          </button>
        </motion.div>
      </div>
    </section>
  )
}
