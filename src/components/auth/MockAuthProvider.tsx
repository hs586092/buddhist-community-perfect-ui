import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  requiresMFA?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  register: (userData: any) => Promise<AuthResult>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Demo user data for immediate testing
const DEMO_USERS = [
  {
    email: 'admin@community.com',
    password: 'admin123',
    name: 'Community Admin',
    role: 'Administrator',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
  },
  {
    email: 'sarah@community.com', 
    password: 'sarah123',
    name: 'Sarah Johnson',
    role: 'Community Leader',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah'
  },
  {
    email: 'mike@community.com',
    password: 'mike123', 
    name: 'Mike Chen',
    role: 'Community Member',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mike'
  },
  {
    email: 'demo@test.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'Community Member', 
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo'
  }
];

/**
 * MockAuthProvider Component
 * 
 * Enhanced mock authentication provider with realistic JWT simulation.
 * Features multiple demo users, session persistence, and error scenarios.
 */
export const MockAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      if (!token.includes('.')) return true;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp && payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, consider it expired
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('demo_auth_token');
        const storedUser = localStorage.getItem('demo_user');

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            console.log('Stored token is expired, clearing auth state');
            localStorage.removeItem('demo_auth_token');
            localStorage.removeItem('demo_user');
          } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('demo_auth_token');
        localStorage.removeItem('demo_user');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate realistic loading delay
    setTimeout(initializeAuth, 800 + Math.random() * 400);
  }, []);

  // Session monitoring - check for token expiration periodically
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const checkTokenValidity = () => {
      if (token && isTokenExpired(token)) {
        console.log('Token expired during session, logging out user');
        logout();
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  // Generate realistic JWT-like token
  const generateMockJWT = (user: User): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa(`mock_signature_${Math.random().toString(36).substr(2, 9)}`);
    return `${header}.${payload}.${signature}`;
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
    
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    // Check against demo users first
    const demoUser = DEMO_USERS.find(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );

    // Simulate MFA requirement for admin users
    if (demoUser?.role === 'Administrator') {
      return { success: false, requiresMFA: true, message: 'Multi-factor authentication required' };
    }

    let mockUser: User;
    
    if (demoUser) {
      // Use predefined demo user
      mockUser = {
        id: `user-${demoUser.email.split('@')[0]}`,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        avatar: demoUser.avatar,
        createdAt: '2024-01-01T00:00:00Z', // Fixed date for demo users
        lastLoginAt: new Date().toISOString()
      };
    } else {
      // Simulate authentication failure for unknown credentials
      return { success: false, message: 'Invalid email or password' };
    }

    const mockToken = generateMockJWT(mockUser);

    setToken(mockToken);
    setUser(mockUser);
    
    localStorage.setItem('demo_auth_token', mockToken);
    localStorage.setItem('demo_user', JSON.stringify(mockUser));

    return { success: true, message: 'Login successful' };
  };

  const register = async (userData: any): Promise<AuthResult> => {
    // Simulate network delay  
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    if (!userData.email || !userData.password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (!userData.firstName || !userData.lastName) {
      return { success: false, message: 'First and last name are required' };
    }

    // Check if user already exists
    const existingUser = DEMO_USERS.find(user => 
      user.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // For demo purposes, don't actually create the user in state
    // Just return success to trigger email verification flow
    return { 
      success: true, 
      message: 'Account created successfully. Please check your email to verify your account.' 
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('demo_auth_token');
    localStorage.removeItem('demo_user');
  };

  const refreshAuth = async () => {
    // In demo mode, just return current user
    if (!token || !user) {
      throw new Error('No active session');
    }
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Throws error if used outside AuthProvider.
 */
export const useMockAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};