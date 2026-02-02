import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Auth credentials
const VALID_CREDENTIALS = {
  username: 'bill',
  password: 'bill',
};

const AUTH_STORAGE_KEY = 'coc_auth';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isAuthenticated && parsed.username) {
            setAuthState({
              isAuthenticated: true,
              username: parsed.username,
            });
          }
        }
      } catch (error) {
        console.error('[Auth] Error reading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      const newState = {
        isAuthenticated: true,
        username,
      };
      
      setAuthState(newState);
      
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('[Auth] Error saving auth state:', error);
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      username: null,
    });
    
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('[Auth] Error clearing auth state:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    username: authState.username,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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

export default AuthContext;
