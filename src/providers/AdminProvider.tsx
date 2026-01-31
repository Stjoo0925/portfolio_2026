'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Simple OTP verify mock for now (will use server actions)
  const verifyOtp = async (otp: string) => {
    // This will call a server action
    if (otp === '123456') { // Placeholder
      setIsAdmin(true);
      toast.success('Admin mode activated');
      return true;
    }
    toast.error('Invalid OTP');
    return false;
  };

  const toggleEditMode = () => {
    if (!isAdmin) {
      toast.error('Admin authentication required');
      return;
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isEditMode, toggleEditMode, verifyOtp }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
