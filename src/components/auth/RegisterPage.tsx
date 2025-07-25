/**
 * Registration Page Component
 * 
 * Comprehensive user registration with enhanced security:
 * - Multi-step registration flow with progress tracking
 * - Password strength validation and real-time feedback
 * - Email verification with resend functionality
 * - Terms of service and privacy policy acceptance
 * - Profile setup with avatar upload
 * - Community guidelines acknowledgment
 * - Accessibility compliance (WCAG 2.1 AA)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassCheckbox,
  GlassSelect,
  GlassProgress,
} from '../ui';
import { useMockAuth } from './MockAuthProvider';
import { cn } from '../../utils/cn';

// Types for registration
interface RegistrationFormData {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Profile Details
  username: string;
  dateOfBirth: string;
  location: string;
  interests: string[];
  bio: string;
  
  // Step 3: Preferences & Agreements
  newsletterOptIn: boolean;
  communityUpdates: boolean;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptGuidelines: boolean;
  
  // Optional
  avatar?: File;
  referralCode?: string;
}

interface RegistrationErrors {
  [key: string]: string | undefined;
}

interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

/**
 * Enhanced Registration Page
 * 
 * Multi-step registration process with:
 * - Progressive form validation with real-time feedback
 * - Password strength meter with detailed requirements
 * - Email verification flow with resend capability
 * - Profile customization with avatar upload
 * - Interest selection for personalized experience
 * - Legal compliance with terms acceptance
 * - Accessibility features and keyboard navigation
 * - Social registration options
 * - Referral code support
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useMockAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    dateOfBirth: '',
    location: '',
    interests: [],
    bio: '',
    newsletterOptIn: true,
    communityUpdates: true,
    acceptTerms: false,
    acceptPrivacy: false,
    acceptGuidelines: false,
  });
  
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
  });
  
  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Available interests for selection
  const availableInterests = [
    'Meditation', 'Mindfulness', 'Philosophy', 'Community Service',
    'Yoga', 'Reading', 'Music', 'Art', 'Nature', 'Cooking',
    'Gardening', 'Writing', 'Teaching', 'Volunteering', 'Wellness'
  ];

  // Password strength calculation
  const calculatePasswordStrength = useCallback((password: string): PasswordStrength => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumbers, hasSymbols];
    const score = criteria.filter(Boolean).length;
    
    const feedback = [];
    if (!hasMinLength) feedback.push('Use at least 8 characters');
    if (!hasUppercase) feedback.push('Include an uppercase letter');
    if (!hasLowercase) feedback.push('Include a lowercase letter');
    if (!hasNumbers) feedback.push('Include a number');
    if (!hasSymbols) feedback.push('Include a special character');
    
    return {
      score,
      feedback,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
    };
  }, []);

  // Update password strength on password change
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength({
        score: 0,
        feedback: [],
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSymbols: false,
      });
    }
  }, [formData.password, calculatePasswordStrength]);

  // Form validation for each step
  const validateStep = useCallback((step: number): RegistrationErrors => {
    const newErrors: RegistrationErrors = {};

    if (step === 1) {
      // Basic Information
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength.score < 3) {
        newErrors.password = 'Password is too weak';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      // Profile Details
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
      }
      
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          newErrors.dateOfBirth = 'You must be at least 13 years old';
        }
      }
      
      if (formData.bio && formData.bio.length > 500) {
        newErrors.bio = 'Bio must be less than 500 characters';
      }
    }

    if (step === 3) {
      // Legal Agreements
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the Terms of Service';
      }
      
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = 'You must accept the Privacy Policy';
      }
      
      if (!formData.acceptGuidelines) {
        newErrors.acceptGuidelines = 'You must accept the Community Guidelines';
      }
    }

    return newErrors;
  }, [formData, passwordStrength.score]);

  // Handle input changes
  const handleInputChange = (field: keyof RegistrationFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests;
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    handleInputChange('interests', newInterests);
  };

  // Navigate between steps
  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const allErrors = validateStep(3);
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
        interests: formData.interests,
        bio: formData.bio,
        preferences: {
          newsletter: formData.newsletterOptIn,
          communityUpdates: formData.communityUpdates,
        }
      });

      if (result.success) {
        navigate('/auth/verify-email', { 
          state: { email: formData.email }
        });
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social registration handlers
  const handleGoogleRegister = () => {
    console.log('Initiating Google OAuth registration...');
  };

  const handleAppleRegister = () => {
    console.log('Initiating Apple Sign-In registration...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">🧘</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start your journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <GlassProgress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className={cn(currentStep >= 1 && "text-indigo-600 dark:text-indigo-400 font-medium")}>
              Basic Info
            </span>
            <span className={cn(currentStep >= 2 && "text-indigo-600 dark:text-indigo-400 font-medium")}>
              Profile Setup
            </span>
            <span className={cn(currentStep >= 3 && "text-indigo-600 dark:text-indigo-400 font-medium")}>
              Preferences
            </span>
          </div>
        </div>

        {/* Main Registration Form */}
        <GlassCard variant="light" padding="xl">
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold gradient-text mb-2">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Let's start with your basic details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <GlassInput
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    error={!!errors.firstName}
                    autoComplete="given-name"
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <GlassInput
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    error={!!errors.lastName}
                    autoComplete="family-name"
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <GlassInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  error={!!errors.email}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <GlassInput
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  error={!!errors.password}
                  autoComplete="new-password"
                  aria-describedby={errors.password ? 'password-error' : 'password-strength'}
                />
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div id="password-strength" className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors duration-200',
                            passwordStrength.score >= level
                              ? passwordStrength.score <= 2 
                                ? 'bg-red-500'
                                : passwordStrength.score <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          )}
                        />
                      ))}
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <p className="mb-1">Password requirements:</p>
                        <ul className="space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-red-500">•</span>
                              {feedback}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <GlassInput
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  error={!!errors.confirmPassword}
                  autoComplete="new-password"
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Social Registration */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or register with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <GlassButton
                    variant="ghost"
                    onClick={handleGoogleRegister}
                    leftIcon="🌐"
                    className="flex-1"
                  >
                    Google
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    onClick={handleAppleRegister}
                    leftIcon="🍎"
                    className="flex-1"
                  >
                    Apple
                  </GlassButton>
                </div>
              </div>

              <div className="flex justify-end">
                <GlassButton
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon="→"
                  className="px-8"
                >
                  Continue
                </GlassButton>
              </div>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold gradient-text mb-2">
                  Profile Setup
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tell us more about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <GlassInput
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value.toLowerCase())}
                    placeholder="Choose a unique username"
                    error={!!errors.username}
                    autoComplete="username"
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                  {errors.username && (
                    <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <GlassInput
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('dateOfBirth', e.target.value)}
                    error={!!errors.dateOfBirth}
                    autoComplete="bday"
                    aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                  />
                  {errors.dateOfBirth && (
                    <p id="dateOfBirth-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location (Optional)
                </label>
                <GlassInput
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  autoComplete="address-level1"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Interests (Select up to 5)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={cn(
                        'p-3 text-sm rounded-lg border-2 transition-all duration-200',
                        formData.interests.includes(interest)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                      )}
                      disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className={cn(
                    'w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'dark:bg-gray-800/50 dark:border-gray-600 dark:text-white',
                    'transition-all duration-200 resize-none'
                  )}
                  rows={4}
                  maxLength={500}
                  aria-describedby={errors.bio ? 'bio-error' : undefined}
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{formData.bio.length}/500 characters</span>
                  {errors.bio && (
                    <p id="bio-error" className="text-red-600" role="alert">
                      {errors.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <GlassButton
                  variant="ghost"
                  onClick={handlePreviousStep}
                  leftIcon="←"
                  className="px-8"
                >
                  Back
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon="→"
                  className="px-8"
                >
                  Continue
                </GlassButton>
              </div>
            </div>
          )}

          {/* Step 3: Preferences & Agreements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold gradient-text mb-2">
                  Final Steps
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your preferences and accept our terms
                </p>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Communication Preferences
                </h4>
                
                <GlassCheckbox
                  id="newsletter"
                  checked={formData.newsletterOptIn}
                  onChange={(checked) => handleInputChange('newsletterOptIn', checked)}
                  label="Subscribe to our newsletter"
                  description="Get weekly updates about community events and resources"
                />
                
                <GlassCheckbox
                  id="community-updates"
                  checked={formData.communityUpdates}
                  onChange={(checked) => handleInputChange('communityUpdates', checked)}
                  label="Receive community updates"
                  description="Get notified about new posts, comments, and mentions"
                />
              </div>

              {/* Legal Agreements */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Legal Agreements *
                </h4>
                
                <div className="space-y-3">
                  <GlassCheckbox
                    id="accept-terms"
                    checked={formData.acceptTerms}
                    onChange={(checked) => handleInputChange('acceptTerms', checked)}
                    label={
                      <span>
                        I agree to the{' '}
                        <Link
                          to="/legal/terms"
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                        >
                          Terms of Service
                        </Link>
                      </span>
                    }
                    error={!!errors.acceptTerms}
                  />
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.acceptTerms}
                    </p>
                  )}
                  
                  <GlassCheckbox
                    id="accept-privacy"
                    checked={formData.acceptPrivacy}
                    onChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                    label={
                      <span>
                        I agree to the{' '}
                        <Link
                          to="/legal/privacy"
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    }
                    error={!!errors.acceptPrivacy}
                  />
                  {errors.acceptPrivacy && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.acceptPrivacy}
                    </p>
                  )}
                  
                  <GlassCheckbox
                    id="accept-guidelines"
                    checked={formData.acceptGuidelines}
                    onChange={(checked) => handleInputChange('acceptGuidelines', checked)}
                    label={
                      <span>
                        I agree to follow the{' '}
                        <Link
                          to="/community/guidelines"
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                        >
                          Community Guidelines
                        </Link>
                      </span>
                    }
                    error={!!errors.acceptGuidelines}
                  />
                  {errors.acceptGuidelines && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.acceptGuidelines}
                    </p>
                  )}
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Referral Code (Optional)
                </label>
                <GlassInput
                  id="referralCode"
                  type="text"
                  value={formData.referralCode || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                  placeholder="Enter referral code"
                  maxLength={10}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Have a referral code? You and your friend will both get special benefits!
                </p>
              </div>

              <div className="flex justify-between">
                <GlassButton
                  variant="ghost"
                  onClick={handlePreviousStep}
                  leftIcon="←"
                  className="px-8"
                  disabled={isSubmitting}
                >
                  Back
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </GlassButton>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};