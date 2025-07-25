import React, { useState } from 'react';
import {
  GlassForm,
  GlassInput,
  GlassButton,
  GlassCard,
  createValidationRules,
} from '../ui';
import { useMockAuth } from './MockAuthProvider';
import { cn } from '../../utils/cn';

interface LoginFormProps {
  onSuccess?: (token: string, user: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * LoginForm Component
 * 
 * Modern authentication form using glassmorphism design system.
 * Integrates with backend auth API for secure login functionality.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  className,
}) => {
  const { login, register } = useMockAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const validationRules = createValidationRules();
  const loginValidationRules = {
    email: { 
      ...validationRules.required(), 
      ...validationRules.email() 
    },
    password: { 
      ...validationRules.required(), 
      ...validationRules.minLength(6) 
    },
  };

  const registerValidationRules = {
    name: {
      ...validationRules.required(),
      ...validationRules.minLength(2)
    },
    email: { 
      ...validationRules.required(), 
      ...validationRules.email() 
    },
    password: { 
      ...validationRules.required(), 
      ...validationRules.minLength(6) 
    },
    confirmPassword: {
      ...validationRules.required(),
      validate: (value: string, formData: any) => {
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return true;
      }
    }
  };

  const handleLogin = async (values: Record<string, any>) => {
    const { email, password } = values as { email: string; password: string };
    setIsLoading(true);
    setAuthError(null);

    try {
      await login(email, password);
      onSuccess?.('demo_token', { email });
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: Record<string, any>) => {
    const { name, email, password } = values as { name: string; email: string; password: string; confirmPassword: string };
    setIsLoading(true);
    setAuthError(null);

    try {
      await register({
        name,
        email,
        password
      });
      onSuccess?.('demo_token', { email });
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;
      
      // Trigger events to update form state
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className={cn('w-full max-w-md', className)}>
      <GlassCard variant="medium" padding="lg" className="backdrop-blur-xl">
        {/* Demo Credentials Toggle */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Demo Mode
          </div>
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {showDemoCredentials ? 'Hide' : 'Show'} Test Accounts
          </button>
        </div>

        {/* Demo Credentials */}
        {showDemoCredentials && (
          <div className="mb-6 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
              Demo Accounts (Click to fill):
            </p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@community.com', 'admin123')}
                className="text-left text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
              >
                👑 Admin - admin@community.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('sarah@community.com', 'sarah123')}
                className="text-left text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
              >
                🌟 Leader - sarah@community.com / sarah123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('demo@test.com', 'demo123')}
                className="text-left text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
              >
                👤 Member - demo@test.com / demo123
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            {isRegisterMode ? 'Join Our Community' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isRegisterMode 
              ? 'Create your account to get started' 
              : 'Sign in to your community account'
            }
          </p>
        </div>

        {/* Error Message */}
        {authError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {authError}
            </p>
          </div>
        )}

        {/* Auth Form */}
        <GlassForm
          variant="minimal"
          spacing="comfortable"
          initialValues={
            isRegisterMode 
              ? { name: '', email: '', password: '', confirmPassword: '' }
              : { email: '', password: '' }
          }
          validationRules={isRegisterMode ? registerValidationRules : loginValidationRules}
          onSubmit={isRegisterMode ? handleRegister : handleLogin}
        >
          {isRegisterMode && (
            <GlassInput
              name="name"
              label="Full Name"
              type="text"
              placeholder="Your full name"
              leftIcon="👤"
              variant="glass"
              required
              autoComplete="name"
              disabled={isLoading}
            />
          )}

          <GlassInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            leftIcon="📧"
            variant="glass"
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <GlassInput
            name="password"
            label={isRegisterMode ? "Create Password" : "Password"}
            type="password"
            placeholder={isRegisterMode ? "Create a password" : "Enter your password"}
            leftIcon="🔒"
            variant="glass"
            required
            autoComplete={isRegisterMode ? "new-password" : "current-password"}
            disabled={isLoading}
          />

          {isRegisterMode && (
            <GlassInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon="🔒"
              variant="glass"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          )}

          {/* Remember Me & Forgot Password (Login only) */}
          {!isRegisterMode && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-white/10 border-white/20 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading 
              ? (isRegisterMode ? 'Creating account...' : 'Signing in...') 
              : (isRegisterMode ? 'Create Account' : 'Sign In')
            }
          </GlassButton>
        </GlassForm>

        {/* Divider (Login only) */}
        {!isRegisterMode && (
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20 dark:border-gray-700"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
              or continue with
            </span>
            <div className="flex-1 border-t border-white/20 dark:border-gray-700"></div>
          </div>
        )}

        {/* Social Login (Login only) */}
        {!isRegisterMode && (
          <div className="grid grid-cols-2 gap-3">
            <GlassButton
              variant="ghost"
              size="md"
              fullWidth
              leftIcon="📱"
              disabled={isLoading}
            >
              Google
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="md"
              fullWidth
              leftIcon="📘"
              disabled={isLoading}
            >
              Facebook
            </GlassButton>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRegisterMode ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setAuthError(null);
                  }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setAuthError(null);
                  }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </GlassCard>
    </div>
  );
};