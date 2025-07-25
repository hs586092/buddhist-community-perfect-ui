/**
 * Event Registration Demo Page
 *
 * Showcases the complete Netflix/Airbnb level event registration system
 * with all modern UX patterns and Buddhist-inspired design elements.
 */

import { addDays, format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

// Components
import { EventRegistrationSystem } from '../components/forms';
import { GlassButton, GlassCard } from '../components/ui';

// Types
import type { EventDetails, EventRegistrationData } from '../types/event-registration';

// Mock event data
const mockEventDetails: EventDetails = {
  id: 'dharma-retreat-2025',
  title: 'Weekend Mindfulness Retreat',
  description: 'A transformative weekend retreat focusing on mindfulness meditation, dharma teachings, and community connection in the serene mountain setting.',
  longDescription: 'Join us for an immersive weekend retreat designed to deepen your meditation practice and understanding of Buddhist teachings. Our experienced teachers will guide you through various meditation techniques, offer insightful dharma talks, and create opportunities for meaningful community connections. Set in the peaceful mountains, this retreat offers the perfect environment for inner reflection and spiritual growth.',
  teacher: {
    name: 'Venerable Thich Mindful Heart',
    title: 'Senior Dharma Teacher',
    bio: 'A respected meditation teacher with over 20 years of experience in Buddhist practice and community leadership.',
    image: '/images/teacher-placeholder.jpg',
    credentials: ['Buddhist Studies Ph.D.', 'Certified Mindfulness Instructor', 'Retreat Leader'],
  },
  schedule: {
    startDate: format(addDays(new Date(), 14), "yyyy-MM-dd'T'09:00:00.000'Z'"),
    endDate: format(addDays(new Date(), 16), "yyyy-MM-dd'T'17:00:00.000'Z'"),
    timezone: 'America/Los_Angeles',
    dailySchedule: [
      { time: '06:00', activity: 'Morning Meditation', duration: 60 },
      { time: '07:30', activity: 'Mindful Breakfast', duration: 90 },
      { time: '09:00', activity: 'Dharma Talk', duration: 90 },
      { time: '11:00', activity: 'Walking Meditation', duration: 60 },
      { time: '12:30', activity: 'Lunch & Rest', duration: 120 },
      { time: '15:00', activity: 'Group Discussion', duration: 90 },
      { time: '17:00', activity: 'Evening Meditation', duration: 60 },
      { time: '19:00', activity: 'Dinner & Community', duration: 120 },
    ],
  },
  location: {
    name: 'Peaceful Mountain Retreat Center',
    address: '1234 Serenity Ridge, Mindful Valley, CA 95000',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    images: [
      '/images/retreat-center-1.jpg',
      '/images/retreat-center-2.jpg',
      '/images/meditation-hall.jpg',
    ],
    facilities: ['Meditation Hall', 'Organic Garden', 'Walking Trails', 'Dining Hall', 'Guest Rooms'],
    accessibility: ['Wheelchair Accessible', 'Hearing Loop', 'Large Print Materials'],
    virtualLink: 'https://dharma-retreat.zoom.us/join',
    isHybrid: true,
  },
  pricing: {
    suggested: 150,
    minimum: 75,
    currency: 'USD',
    includesAccommodation: true,
    includesMeals: true,
    scholarshipsAvailable: true,
  },
  capacity: {
    total: 30,
    remaining: 12,
    waitlistSize: 3,
    registrationDeadline: format(addDays(new Date(), 10), "yyyy-MM-dd'T'23:59:59.000'Z'"),
  },
  tags: ['mindfulness', 'meditation', 'retreat', 'dharma', 'community'],
  images: [
    '/images/lotus-meditation.jpg',
    '/images/mountain-view.jpg',
    '/images/dharma-teaching.jpg',
  ],
  testimonials: [
    {
      text: 'This retreat completely transformed my understanding of mindfulness. The teachings were profound yet accessible.',
      author: 'Sarah Chen',
      role: 'Previous Attendee',
      avatar: '/images/testimonial-1.jpg',
    },
    {
      text: 'The perfect blend of meditation, learning, and community. I left feeling renewed and inspired.',
      author: 'Michael Rodriguez',
      role: 'Regular Practitioner',
      avatar: '/images/testimonial-2.jpg',
    },
  ],
};

export const EventRegistrationDemo: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState<EventRegistrationData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle registration completion
  const handleRegistrationComplete = async (data: EventRegistrationData) => {
    console.log('Registration completed:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCompletedRegistration(data);
    setShowRegistration(false);

    // In a real app, this would send data to the backend
    // await api.submitEventRegistration(data);
  };

  // Handle mobile detection
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Netflix-Level
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Event Registration
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the future of dharma event registration with lotus petal progress,
                zen garden capacity visualization, and WhatsApp-style confirmations.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🪷</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Lotus Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Beautiful step progress with blooming lotus petals and zen animations
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🏮</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Zen Garden Capacity
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Stone patterns showing event capacity in a meditative garden metaphor
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  WhatsApp Confirmation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Chat-like confirmation flow with progressive message reveals
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassButton
                size="lg"
                variant="primary"
                onClick={() => setShowRegistration(true)}
                className="text-lg px-8 py-4"
              >
                🎯 Experience the Demo
              </GlassButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Event Preview Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <GlassCard className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {mockEventDetails.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {mockEventDetails.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="font-medium">Weekend Retreat</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        3 days of mindful practice
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="font-medium">{mockEventDetails.location.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Mountain retreat center
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-medium">
                        {mockEventDetails.capacity.remaining} spots remaining
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Out of {mockEventDetails.capacity.total} total
                      </div>
                    </div>
                  </div>
                </div>

                <GlassButton
                  variant="primary"
                  onClick={() => setShowRegistration(true)}
                  rightIcon="→"
                  className="w-full md:w-auto"
                >
                  Register Now
                </GlassButton>
              </div>

              {/* Event Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl">🧘‍♀️</div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ${mockEventDetails.pricing.suggested} Suggested Dana
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {completedRegistration && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCompletedRegistration(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Demo Completed!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You've experienced the full Netflix/Airbnb level registration flow.
                Beautiful, isn't it?
              </p>
              <GlassButton
                variant="primary"
                onClick={() => setCompletedRegistration(null)}
                className="w-full"
              >
                Awesome! 🙏
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration System Modal */}
      <AnimatePresence>
        {showRegistration && (
          <div className="fixed inset-0 z-50">
            <EventRegistrationSystem
              eventDetails={mockEventDetails}
              onComplete={handleRegistrationComplete}
              onCancel={() => setShowRegistration(false)}
              isMobile={isMobile}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Background Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
