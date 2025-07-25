/**
 * Authentication Service
 * 
 * Mock authentication service for development purposes.
 * Provides login, register, logout, and profile methods.
 */

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'Administrator',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'Member',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Auth API Service
 */
export const auth = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await delay(500); // Simulate API call
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    return {
      user: { ...user, lastLoginAt: new Date().toISOString() },
      token,
    };
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    await delay(500); // Simulate API call
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: userData.email,
      name: userData.name,
      role: 'Member',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    return {
      user: newUser,
      token,
    };
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    await delay(300); // Simulate API call
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // Extract user ID from token
    const userId = token.split('-')[2];
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await delay(200); // Simulate API call
    // In a real app, this would invalidate the token on the server
  },

  /**
   * Set authentication token
   */
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Clear authentication token
   */
  clearToken: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem('auth_token'));
  },

  /**
   * Get authentication status
   */
  getStatus: () => {
    const hasToken = Boolean(localStorage.getItem('auth_token'));
    return {
      hasToken,
      services: {
        auth: true,
        api: true,
        websocket: false,
      },
    };
  },
};