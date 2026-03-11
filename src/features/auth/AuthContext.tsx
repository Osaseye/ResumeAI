import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
        try {
            // Configure to use Session persistence (per tab)
            // This allows multiple users to be logged in on different tabs
            await setPersistence(auth, browserSessionPersistence);
        } catch (error) {
            console.error("Error setting auth persistence:", error);
        }

        unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    };

    initializeAuth();
    
    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    // Clear potentially leaky local storage keys on explicit logout
    localStorage.removeItem('dashboard_stats_cache');
    localStorage.removeItem('dashboard_profile_cache');
    localStorage.removeItem('dashboard_jobs_cache');
    localStorage.removeItem('interview_stats');
    localStorage.removeItem('saved_jobs_data'); 
    localStorage.removeItem('onboarding_data');
    
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    // During HMR or edge-case re-renders the provider may be absent.
    // Return a safe default so the tree doesn't crash.
    return { user: null, loading: true, logout: async () => {} } as AuthContextType;
  }
  return context;
};
