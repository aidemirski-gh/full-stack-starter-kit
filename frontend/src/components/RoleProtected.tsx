'use client';

import { useRoleAccess } from '@/hooks/useRoleAccess';

interface RoleProtectedProps {
  children: React.ReactNode;
  requiredRoles: string | string[];
  fallback?: React.ReactNode;
}

export default function RoleProtected({ children, requiredRoles, fallback }: RoleProtectedProps) {
  const { hasAccess, loading } = useRoleAccess(requiredRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
          <div className="text-gray-500 font-medium">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}
