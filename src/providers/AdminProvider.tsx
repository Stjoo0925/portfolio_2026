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

  // OTP verify using server action
  const verifyOtp = async (otp: string) => {
    const { checkAdminOTP } = await import('@/app/actions/admin');
    const isValid = await checkAdminOTP(otp);
    
    if (isValid) {
      setIsAdmin(true);
      toast.success('관리자 모드가 활성화되었습니다.');
      return true;
    }
    toast.error('잘못된 OTP 번호입니다.');
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
