/**
 * Forgot Password Page Component
 * 
 * Secure password reset flow with enhanced security:
 * - Email verification with rate limiting
 * - Password reset token validation
 * - Secure password reset form
 * - Multi-step recovery process
 * - Security notifications
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '../ui';
// import { cn } from '../../utils/cn'; // Unused import

// Types for password reset
interface ResetFormData {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
  resetCode?: string;
}

interface ResetErrors {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
  resetCode?: string;
  general?: string;
}

/**
 * Enhanced Forgot Password Page
 * 
 * Multi-step password reset flow:
 * 1. Email submission with verification
 * 2. Reset code validation
 * 3. New password creation
 * 4. Confirmation and login redirect
 */
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [currentStep, setCurrentStep] = useState(token ? 2 : 1); // Skip to step 2 if token in URL
  const [formData, setFormData] = useState<ResetFormData>({
    email: searchParams.get('email') || '',
    resetCode: token || '',
  });
  const [errors, setErrors] = useState<ResetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Validation
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email address is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  // Handle input changes
  const handleInputChange = (field: keyof ResetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Step 1: Send reset email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email || '');
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock API response
      const mockResponse = { success: true };

      if (mockResponse.success) {
        setCurrentStep(2);
        
        // Start resend timer
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrors({ general: 'Failed to send reset email. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify reset code and set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: ResetErrors = {};

    if (!formData.resetCode) {
      newErrors.resetCode = 'Reset code is required';
    } else if (formData.resetCode.length !== 6) {
      newErrors.resetCode = 'Reset code must be 6 characters';
    }

    const passwordError = validatePassword(formData.newPassword || '');
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock API response
      const mockResponse = { success: true };

      if (mockResponse.success) {
        setCurrentStep(3);
      } else {
        setErrors({ general: 'Invalid or expired reset code. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend reset email
  const handleResendEmail = async () => {
    if (resendTimer > 0) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Restart timer
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ general: 'Failed to resend email. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">🔐</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            {currentStep === 1 && 'Reset Password'}
            {currentStep === 2 && 'Check Your Email'}
            {currentStep === 3 && 'Password Reset Complete'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentStep === 1 && 'Enter your email to receive reset instructions'}
            {currentStep === 2 && 'Enter the reset code from your email'}
            {currentStep === 3 && 'Your password has been successfully reset'}
          </p>
        </div>

        <GlassCard variant="light" padding="xl" className="space-y-6">
          {/* General Error Message */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Step 1: Email Submission */}
          {currentStep === 1 && (
            <form onSubmit={handleSendResetEmail} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <GlassInput
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  error={errors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Reset Email...' : 'Send Reset Email'}
              </GlassButton>
            </form>
          )}

          {/* Step 2: Reset Code and New Password */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-2">📧</div>
                <p className="text-sm text-blue-700">
                  We've sent a reset code to <strong>{formData.email}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Check your spam folder if you don't see it
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Reset Code */}
                <div>
                  <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reset Code *
                  </label>
                  <GlassInput
                    id="resetCode"
                    type="text"
                    value={formData.resetCode || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('resetCode', e.target.value.replace(/\s/g, '').slice(0, 6))}
                    placeholder="Enter 6-character code"
                    error={errors.resetCode}
                    disabled={isSubmitting}
                    maxLength={6}
                    className="w-full text-center text-lg tracking-wider"
                    aria-describedby={errors.resetCode ? 'resetCode-error' : undefined}
                  />
                  {errors.resetCode && (
                    <p id="resetCode-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.resetCode}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password *
                  </label>
                  <GlassInput
                    id="newPassword"
                    type="password"
                    value={formData.newPassword || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                    error={errors.newPassword}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                    className="w-full"
                  />
                  {errors.newPassword && (
                    <p id="newPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password *
                  </label>
                  <GlassInput
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    className="w-full"
                  />
                  {errors.confirmPassword && (
                    <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <GlassButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </GlassButton>
              </form>

              {/* Resend Email */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <GlassButton
                  variant="ghost"
                  onClick={handleResendEmail}
                  disabled={resendTimer > 0 || isSubmitting}
                  className="text-sm"
                >
                  {resendTimer > 0 
                    ? `Resend in ${resendTimer}s`
                    : 'Resend Email'
                  }
                </GlassButton>
              </div>
            </div>
          )}

          {/* Step 3: Success Message */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <div className="space-y-3">
                <GlassButton
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In Now
                </GlassButton>
                
                <GlassButton
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </GlassButton>
              </div>

              {/* Security Note */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">🔒</span>
                  <div className="text-left">
                    <p className="text-sm text-yellow-800 font-medium mb-1">
                      Security Reminder
                    </p>
                    <p className="text-xs text-yellow-700">
                      For your security, we recommend signing out of all devices and signing back in with your new password.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Back to Login Link */}
        {currentStep !== 3 && (
          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
            >
              ← Back to Sign In
            </Link>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Reset links expire after 15 minutes for your security
          </p>
        </div>
      </div>
    </div>
  );
};