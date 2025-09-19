// app/admin/layout.tsx - UPDATED
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      // Check if user is authorized (doctor or admin)
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }

      const isAdminUser = isAdmin || user.role === 'doctor' || user.role === 'hospital-admin';
      
      if (!isAdminUser) {
        router.push('/unauthorized');
        return;
      }
      
      setIsAuthorized(true);
      setLoading(false);
    }
  }, [user, authLoading, isAdmin, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <div className="text-sm text-gray-500">
              {user?.role === 'doctor' ? 'Doctor Access' : 'Hospital Admin Access'} • Database Management
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}