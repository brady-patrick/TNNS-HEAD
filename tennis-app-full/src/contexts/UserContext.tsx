import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  location: string;
  birthday: string; // ISO date string
  age: number;
  utr: number;
  usta: number;
  nsl: number;
  utrTrend: "positive" | "negative";
  ustaTrend: "positive" | "negative";
  nslTrend: "positive" | "negative";
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatarUrl: string) => void;
  updateCoverImage: (coverImageUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Calculate age from birthday
const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Initial user data
const initialUser: UserProfile = {
  name: "Olivia Rhye",
  email: "olivia@untitledui.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop",
  location: "Fort Collins, CO",
  birthday: "2007-03-15", // March 15, 2007
  age: 17,
  utr: 7.8,
  usta: 1453,
  nsl: 212,
  utrTrend: "positive",
  ustaTrend: "negative",
  nslTrend: "positive",
};

// Helper function to safely save to localStorage
const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    // Check if the value is too large (localStorage typically has 5-10MB limit)
    if (value.length > 4 * 1024 * 1024) { // 4MB limit
      console.warn('Data too large for localStorage, storing in sessionStorage instead');
      sessionStorage.setItem(key, value);
      return true;
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, storing in sessionStorage instead');
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch (sessionError) {
        console.error('Failed to store in sessionStorage:', sessionError);
        return false;
      }
    }
    console.error('Failed to store data:', error);
    return false;
  }
};

// Helper function to safely get from storage
const safeStorageGet = (key: string): string | null => {
  try {
    // Try localStorage first
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    
    // Fall back to sessionStorage
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue) return sessionValue;
    
    return null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(initialUser);

  // Update user profile
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updates };
      
      // If birthday is updated, recalculate age
      if (updates.birthday) {
        newUser.age = calculateAge(updates.birthday);
      }
      
      return newUser;
    });
  };

  // Update avatar specifically
  const updateAvatar = (avatarUrl: string) => {
    setUser(prevUser => ({ ...prevUser, avatar: avatarUrl }));
  };

  // Update cover image specifically
  const updateCoverImage = (coverImageUrl: string) => {
    setUser(prevUser => ({ ...prevUser, coverImage: coverImageUrl }));
  };

  // Load user data from storage on mount
  useEffect(() => {
    try {
      const savedUser = safeStorageGet('tennis-app-user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Ensure age is calculated correctly
        if (parsedUser.birthday) {
          parsedUser.age = calculateAge(parsedUser.birthday);
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse saved user data:', error);
      // Continue with initial user data
    }
  }, []);

  // Save user data to storage whenever it changes
  useEffect(() => {
    try {
      // Store the user data directly (including images)
      const success = safeLocalStorageSet('tennis-app-user', JSON.stringify(user));
      if (!success) {
        console.warn('Failed to save user data to storage');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [user]);



  return (
    <UserContext.Provider value={{ user, updateUser, updateAvatar, updateCoverImage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
