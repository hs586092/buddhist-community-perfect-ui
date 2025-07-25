import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { isAmplifyConfigured } from '../../lib/amplify';
import '@aws-amplify/ui-react/styles.css';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      if (isAmplifyConfigured()) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut: handleSignOut,
  };

  // Amplify가 구성되지 않은 경우 모킹된 상태 제공
  if (!isAmplifyConfigured()) {
    return (
      <AuthContext.Provider 
        value={{
          user: null,
          isAuthenticated: false,
          isLoading: false,
          signOut: async () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <Authenticator.Provider>
        {children}
      </Authenticator.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Amplify UI 컴포넌트 (개발/테스트용)
export const AuthenticatorWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (!isAmplifyConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🏛️ 개발 모드
          </h2>
          <p className="text-gray-600 mb-4">
            Amplify가 구성되지 않았습니다. 데모 모드로 실행됩니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <Authenticator>
      {children}
    </Authenticator>
  );
};