/**
 * Email Verification Page Component
 * 
 * Email verification flow with enhanced UX:
 * - Automatic token verification from URL
 * - Manual verification code entry
 * - Resend verification functionality
 * - Success/error states with clear messaging
 * - Accessibility compliance
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '../ui';
import { cn } from '../../utils/cn';

// Types for email verification
interface VerificationState {
  status: 'pending' | 'verifying' | 'success' | 'error';
  message: string | null;
  email?: string;
}

/**
 * Enhanced Email Verification Page
 * 
 * Comprehensive email verification with:
 * - Automatic verification from email link tokens
 * - Manual verification code entry as fallback
 * - Resend functionality with rate limiting
 * - Clear status feedback and error handling
 * - Accessibility features and keyboard navigation
 */
export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email') || (location.state as any)?.email;
  
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: token ? 'verifying' : 'pending',
    email: email,
    message: null
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    }
  }, [token]);

  // Verify email token from URL
  const verifyEmailToken = async (tokenToVerify: string) => {
    setVerificationState(prev => ({ ...prev, status: 'verifying' }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock token validation
      const isValidToken = tokenToVerify.length > 10; // Simple mock validation

      if (isValidToken) {
        setVerificationState({
          status: 'success',
          email: email,
          message: 'Your email has been successfully verified!'
        });
        
        // Redirect to login after success
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { verified: true, email: email }
          });
        }, 3000);
      } else {
        setVerificationState({
          status: 'error',
          email: email,
          message: 'Invalid or expired verification link. Please try again.'
        });
      }
    } catch (error) {
      setVerificationState({
        status: 'error',
        email: email,
        message: 'Verification failed. Please try again.'
      });
    }
  };

  // Manual verification with code
  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationState(prev => ({
        ...prev,
        message: 'Please enter a valid 6-digit verification code'
      }));
      return;
    }

    setIsSubmitting(true);
    setVerificationState(prev => ({ ...prev, status: 'verifying', message: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock code validation
      const isValidCode = verificationCode === '123456'; // Simple mock

      if (isValidCode) {
        setVerificationState({
          status: 'success',
          email: email,
          message: 'Your email has been successfully verified!'
        });
        
        // Redirect to login after success
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { verified: true, email: email }
          });
        }, 3000);
      } else {
        setVerificationState({
          status: 'error',
          email: email,
          message: 'Invalid verification code. Please check your email and try again.'
        });
      }
    } catch (error) {
      setVerificationState({
        status: 'error',
        email: email,
        message: 'Verification failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (resendTimer > 0 || resendCount >= 3) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResendCount(prev => prev + 1);
      setVerificationState(prev => ({
        ...prev,
        message: 'Verification email sent! Please check your inbox.'
      }));

      // Start resend timer
      const delay = Math.min(60 * Math.pow(2, resendCount), 300); // Exponential backoff, max 5 minutes
      setResendTimer(delay);
      
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
      setVerificationState(prev => ({
        ...prev,
        message: 'Failed to resend verification email. Please try again later.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      : `${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className={cn(
            "mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-4",
            verificationState.status === 'success' 
              ? "bg-gradient-to-r from-green-600 to-emerald-600"
              : verificationState.status === 'error'
              ? "bg-gradient-to-r from-red-600 to-rose-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          )}>
            <span className="text-white font-bold text-xl">
              {verificationState.status === 'success' && '✅'}
              {verificationState.status === 'error' && '❌'}
              {(verificationState.status === 'pending' || verificationState.status === 'verifying') && '📧'}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold gradient-text mb-2">
            {verificationState.status === 'success' && 'Email Verified!'}
            {verificationState.status === 'error' && 'Verification Failed'}
            {verificationState.status === 'verifying' && 'Verifying Email...'}
            {verificationState.status === 'pending' && 'Verify Your Email'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400">
            {verificationState.status === 'success' && 'Your email has been successfully verified'}
            {verificationState.status === 'error' && 'There was a problem verifying your email'}
            {verificationState.status === 'verifying' && 'Please wait while we verify your email'}
            {verificationState.status === 'pending' && 'Check your email for the verification link'}
          </p>
        </div>

        <GlassCard variant="light" padding="xl" className="space-y-6">
          {/* Status Message */}
          {verificationState.message && (
            <div className={cn(
              "p-4 rounded-lg border",
              verificationState.status === 'success' 
                ? "bg-green-50 border-green-200"
                : verificationState.status === 'error'
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            )}>
              <div className="flex items-center gap-2">
                <span className={cn(
                  verificationState.status === 'success' 
                    ? "text-green-600"
                    : verificationState.status === 'error'
                    ? "text-red-600"
                    : "text-blue-600"
                )}>
                  {verificationState.status === 'success' && '✅'}
                  {verificationState.status === 'error' && '⚠️'}
                  {verificationState.status === 'pending' && 'ℹ️'}
                </span>
                <p className={cn(
                  "text-sm",
                  verificationState.status === 'success' 
                    ? "text-green-700"
                    : verificationState.status === 'error'
                    ? "text-red-700"
                    : "text-blue-700"
                )}>
                  {verificationState.message}
                </p>
              </div>
            </div>
          )}

          {/* Verifying State */}
          {verificationState.status === 'verifying' && (
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifying your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {verificationState.status === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎉</span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to the Community!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your account is now active. You'll be redirected to sign in shortly.
                </p>
              </div>

              <div className="space-y-3">
                <GlassButton
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/auth/login', { state: { verified: true, email: email } })}
                >
                  Continue to Sign In
                </GlassButton>
                
                <GlassButton
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </GlassButton>
              </div>
            </div>
          )}

          {/* Error State or Manual Verification */}
          {(verificationState.status === 'pending' || verificationState.status === 'error') && (
            <div className="space-y-6">
              {/* Email Display */}
              {email && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-4xl mb-2">📧</div>
                  <p className="text-sm text-blue-700">
                    We sent a verification email to
                  </p>
                  <p className="text-sm font-semibold text-blue-800">
                    {email}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Check your spam folder if you don't see it
                  </p>
                </div>
              )}

              {/* Manual Verification Form */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                  Enter Verification Code
                </h4>
                
                <form onSubmit={handleManualVerification} className="space-y-4">
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      6-Digit Code
                    </label>
                    <GlassInput
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      disabled={isSubmitting}
                      maxLength={6}
                      className="w-full text-center text-lg tracking-wider"
                    />
                  </div>

                  <GlassButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting || verificationCode.length !== 6}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                  </GlassButton>
                </form>
              </div>

              {/* Resend Verification */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the email?
                </p>
                
                <div className="space-y-2">
                  <GlassButton
                    variant="ghost"
                    onClick={handleResendVerification}
                    disabled={resendTimer > 0 || isSubmitting || resendCount >= 3}
                    className="text-sm"
                  >
                    {resendTimer > 0 
                      ? `Resend in ${formatTime(resendTimer)}`
                      : resendCount >= 3
                      ? 'Maximum resends reached'
                      : 'Resend Verification Email'
                    }
                  </GlassButton>
                  
                  {resendCount >= 3 && (
                    <p className="text-xs text-gray-500">
                      Please contact support if you continue having issues
                    </p>
                  )}
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Having trouble?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link
                      to="/support/contact"
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                    >
                      Contact Support
                    </Link>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <Link
                      to="/auth/register"
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline"
                    >
                      Try Different Email
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Back to Login Link */}
        {verificationState.status !== 'success' && (
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
            Verification links expire after 24 hours for your security
          </p>
        </div>
      </div>
    </div>
  );
};