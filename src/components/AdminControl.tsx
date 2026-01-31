'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/providers/AdminProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lock, Settings, Edit2 } from 'lucide-react';

export function AdminControl() {
  const { isAdmin, isEditMode, toggleEditMode, verifyOtp } = useAdmin();
  const [otp, setOtp] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(otp);
    if (success) {
      setIsOpen(false);
      setOtp('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2">
      {isAdmin ? (
        <Button
          variant={isEditMode ? "default" : "secondary"}
          size="icon"
          className="rounded-full shadow-lg"
          onClick={toggleEditMode}
        >
          {isEditMode ? <Settings className="h-5 w-5 animate-spin-slow" /> : <Edit2 className="h-5 w-5" />}
        </Button>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full opacity-20 hover:opacity-100 transition-opacity"
            >
              <Lock className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Authentication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
              />
              <Button type="submit">Verify</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
