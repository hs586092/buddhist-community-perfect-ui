/**
 * Event Registration System - Netflix/Airbnb Level UX
 *
 * Features:
 * - Multi-step form with lotus petal progress
 * - Real-time validation with gentle animations
 * - Smart date/time picker with temple schedule
 * - Capacity visualization with zen garden metaphor
 * - WhatsApp-style confirmation flow
 * - Mobile-first responsive design
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

// Components
import { GlassButton, GlassCard, GlassInput } from '../ui';
import { LotusProgressIndicator } from './LotusProgressIndicator';
import { MobileBottomSheet } from './MobileBottomSheet';
import { WhatsAppConfirmation } from './WhatsAppConfirmation';
import { ZenCapacityVisualization } from './ZenCapacityVisualization';

// Types
import type {
    AnimationStates,
    EventDetails,
    EventRegistrationData,
    RegistrationProgress,
    RegistrationStep
} from '../../types/event-registration';

// Validation Schema with Zod
const registrationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    emergencyContact: z.object({
      name: z.string().min(2, 'Emergency contact name is required'),
      phone: z.string().min(10, 'Valid phone number is required'),
      relationship: z.string().min(2, 'Relationship is required'),
    }).optional(),
  }),
  preferences: z.object({
    meditationExperience: z.enum(['beginner', 'intermediate', 'advanced']),
    participationStyle: z.enum(['silent', 'guided', 'discussion']),
    dietaryRequirements: z.array(z.string()).optional(),
    accessibilityNeeds: z.array(z.string()).optional(),
    transportationNeeds: z.boolean().optional(),
    accommodationRequired: z.boolean().optional(),
  }),
  payment: z.object({
    method: z.enum(['dana', 'card', 'transfer', 'cash']),
    danaAmount: z.number().optional(),
    scholarshipRequested: z.boolean().optional(),
  }),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
  marketingConsent: z.boolean(),
});

interface EventRegistrationSystemProps {
  eventDetails: EventDetails;
  onComplete: (data: EventRegistrationData) => Promise<void>;
  onCancel: () => void;
  isMobile?: boolean;
  prefilledData?: Partial<EventRegistrationData>;
}

export const EventRegistrationSystem: React.FC<EventRegistrationSystemProps> = ({
  eventDetails,
  onComplete,
  onCancel,
  isMobile = false,
  prefilledData,
}) => {
  // Form state management
  const methods = useForm<EventRegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      eventId: eventDetails.id,
      eventTitle: eventDetails.title,
      eventDate: eventDetails.schedule.startDate,
      eventLocation: eventDetails.location.name,
      eventCapacity: eventDetails.capacity.total,
      currentAttendees: eventDetails.capacity.total - eventDetails.capacity.remaining,
      registrationSource: isMobile ? 'mobile' : 'web',
      agreedToTerms: false,
      marketingConsent: false,
      ...prefilledData,
    },
    mode: 'onChange',
  });

  // Registration flow state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationStates>({
    stepTransition: 'slide-right',
    lotusProgress: 0,
    gardenVisualization: {
      stones: [],
      waterFlow: { active: false, speed: 1 },
      bloomingLotus: { petals: 8, openness: 0 },
    },
    loading: {
      skeleton: false,
      shimmer: false,
      pulsePattern: 'gentle',
    },
  });

  // Registration steps configuration
  const steps: RegistrationStep[] = [
    {
      id: 'event-overview',
      title: 'Event Overview',
      description: 'Review event details and capacity',
      icon: '🪷',
      status: currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'pending',
      lotusProgress: currentStep > 0 ? 100 : currentStep === 0 ? 50 : 0,
    },
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Your details for registration',
      icon: '👤',
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending',
      lotusProgress: currentStep > 1 ? 100 : currentStep === 1 ? 50 : 0,
    },
    {
      id: 'preferences',
      title: 'Preferences & Needs',
      description: 'Customize your experience',
      icon: '🧘‍♀️',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
      lotusProgress: currentStep > 2 ? 100 : currentStep === 2 ? 50 : 0,
    },
    {
      id: 'payment',
      title: 'Payment & Dana',
      description: 'Complete your registration',
      icon: '💝',
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
      lotusProgress: currentStep > 3 ? 100 : currentStep === 3 ? 50 : 0,
    },
  ];

  // Progress tracking
  const registrationProgress: RegistrationProgress = {
    currentStep,
    totalSteps: steps.length,
    completedSteps: steps.filter(step => step.status === 'completed').map(step => step.id),
    validationErrors: methods.formState.errors,
    timeSpent: 0, // Would track actual time in production
    saveProgress: useCallback(() => {
      localStorage.setItem('dharma-registration-progress', JSON.stringify({
        currentStep,
        formData: methods.getValues(),
        timestamp: Date.now(),
      }));
    }, [currentStep, methods]),
    restoreProgress: useCallback(() => {
      const saved = localStorage.getItem('dharma-registration-progress');
      if (saved) {
        const data = JSON.parse(saved);
        setCurrentStep(data.currentStep);
        methods.reset(data.formData);
      }
    }, [methods]),
  };

  // Auto-save progress
  useEffect(() => {
    const timer = setInterval(registrationProgress.saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(timer);
  }, [registrationProgress.saveProgress]);

  // Handle step navigation
  const nextStep = async () => {
    const isStepValid = await methods.trigger();
    if (isStepValid && currentStep < steps.length - 1) {
      setAnimationState(prev => ({ ...prev, stepTransition: 'slide-left' }));
      setCurrentStep(prev => prev + 1);

      // Update lotus progress with smooth animation
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          lotusProgress: ((currentStep + 1) / steps.length) * 100,
        }));
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setAnimationState(prev => ({ ...prev, stepTransition: 'slide-right' }));
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: EventRegistrationData) => {
    setIsSubmitting(true);
    try {
      await onComplete(data);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // Responsive wrapper for mobile
  const FormWrapper = isMobile ? MobileBottomSheet : 'div';

  return (
    <FormProvider {...methods}>
      <FormWrapper {...(isMobile ? { onClose: onCancel } : {})}>
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Header with Lotus Progress */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold gradient-text">
                Register for {eventDetails.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {format(parseISO(eventDetails.schedule.startDate), 'PPP')} at {eventDetails.location.name}
              </p>
            </motion.div>

            {/* Lotus Progress Indicator */}
            <LotusProgressIndicator
              steps={steps}
              currentStep={currentStep}
              progress={animationState.lotusProgress}
              animationSpeed="gentle"
            />
          </div>

          {/* Main Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: animationState.stepTransition === 'slide-left' ? 100 : -100
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: animationState.stepTransition === 'slide-left' ? -100 : 100
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {currentStep === 0 && (
                <EventOverviewStep
                  eventDetails={eventDetails}
                  animationState={animationState}
                />
              )}

              {currentStep === 1 && (
                <PersonalInfoStep
                  methods={methods}
                  isMobile={isMobile}
                />
              )}

              {currentStep === 2 && (
                <PreferencesStep
                  methods={methods}
                  eventDetails={eventDetails}
                />
              )}

              {currentStep === 3 && (
                <PaymentStep
                  methods={methods}
                  eventDetails={eventDetails}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <GlassButton
              variant="ghost"
              onClick={currentStep === 0 ? onCancel : prevStep}
              disabled={isSubmitting}
              leftIcon={currentStep === 0 ? "✕" : "←"}
            >
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </GlassButton>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <GlassButton
                variant="primary"
                onClick={nextStep}
                disabled={isSubmitting}
                rightIcon="→"
              >
                Continue
              </GlassButton>
            ) : (
              <GlassButton
                variant="primary"
                onClick={methods.handleSubmit(handleSubmit)}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                rightIcon="✓"
              >
                Complete Registration
              </GlassButton>
            )}
          </div>
        </div>

        {/* WhatsApp-style Confirmation */}
        <AnimatePresence>
          {showConfirmation && (
            <WhatsAppConfirmation
              eventDetails={eventDetails}
              registrationData={methods.getValues()}
              onClose={() => setShowConfirmation(false)}
            />
          )}
        </AnimatePresence>
      </FormWrapper>
    </FormProvider>
  );
};

// Step Components (to be implemented)
const EventOverviewStep: React.FC<{
  eventDetails: EventDetails;
  animationState: AnimationStates;
}> = ({ eventDetails, animationState }) => (
  <GlassCard className="p-6 space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      {/* Event Hero Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={eventDetails.images[0] || '/placeholder-temple.jpg'}
          alt={eventDetails.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{eventDetails.title}</h3>
          <p className="text-sm opacity-90">{eventDetails.location.name}</p>
        </div>
      </div>

      {/* Capacity Visualization */}
      <ZenCapacityVisualization
        total={eventDetails.capacity.total}
        registered={eventDetails.capacity.total - eventDetails.capacity.remaining}
        pattern="zen-garden"
        animationSpeed="gentle"
      />
    </div>

    {/* Event Details */}
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📅</span>
        <div>
          <p className="font-medium">Date & Time</p>
          <p className="text-gray-600 dark:text-gray-400">
            {format(parseISO(eventDetails.schedule.startDate), 'PPP p')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">👥</span>
        <div>
          <p className="font-medium">Capacity</p>
          <p className="text-gray-600 dark:text-gray-400">
            {eventDetails.capacity.remaining} spots remaining
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">💝</span>
        <div>
          <p className="font-medium">Dana Suggestion</p>
          <p className="text-gray-600 dark:text-gray-400">
            ${eventDetails.pricing.suggested}
          </p>
        </div>
      </div>
    </div>
  </GlassCard>
);

const PersonalInfoStep: React.FC<{
  methods: any;
  isMobile: boolean;
}> = ({ methods, isMobile }) => (
  <GlassCard className="p-6 space-y-6">
    <h2 className="text-xl font-semibold gradient-text">Personal Information</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <GlassInput
        label="First Name"
        placeholder="Enter your first name"
        {...methods.register('personalInfo.firstName')}
        error={methods.formState.errors.personalInfo?.firstName?.message}
        autoFocus={!isMobile}
      />
      <GlassInput
        label="Last Name"
        placeholder="Enter your last name"
        {...methods.register('personalInfo.lastName')}
        error={methods.formState.errors.personalInfo?.lastName?.message}
      />
      <GlassInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        {...methods.register('personalInfo.email')}
        error={methods.formState.errors.personalInfo?.email?.message}
      />
      <GlassInput
        label="Phone (Optional)"
        type="tel"
        placeholder="+1 (555) 000-0000"
        {...methods.register('personalInfo.phone')}
      />
    </div>
  </GlassCard>
);

const PreferencesStep: React.FC<{
  methods: any;
  eventDetails: EventDetails;
}> = ({ methods, eventDetails }) => (
  <GlassCard className="p-6 space-y-6">
    <h2 className="text-xl font-semibold gradient-text">Your Preferences</h2>
    {/* Preferences form fields will be implemented */}
    <p className="text-gray-600 dark:text-gray-400">
      Preferences form fields coming next...
    </p>
  </GlassCard>
);

const PaymentStep: React.FC<{
  methods: any;
  eventDetails: EventDetails;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}> = ({ methods, eventDetails, onSubmit, isSubmitting }) => (
  <GlassCard className="p-6 space-y-6">
    <h2 className="text-xl font-semibold gradient-text">Payment & Dana</h2>
    {/* Payment form fields will be implemented */}
    <p className="text-gray-600 dark:text-gray-400">
      Payment form fields coming next...
    </p>
  </GlassCard>
);
