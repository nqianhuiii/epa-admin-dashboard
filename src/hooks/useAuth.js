'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            setIsAuthenticated(data.authenticated);
          }
        } else {
          if (mounted) {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        
        // Force client-side navigation with multiple fallbacks
        console.log('Login successful, attempting navigation...');
        
        // Method 1: Try router.push with refresh
        try {
          await router.push('/users');
          router.refresh();
        } catch (routerError) {
          console.error('Router.push failed:', routerError);
          
          // Method 2: Force a hard redirect
          window.location.replace('/users');
        }
        
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setIsAuthenticated(false);
      window.location.replace('/auth/signin');
    }
  };

  const checkAuth = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};