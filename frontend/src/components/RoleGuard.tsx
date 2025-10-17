'use client';

import { checkUserRole } from '@/hooks/useRoleAccess';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: string | string[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, requiredRoles, fallback = null }: RoleGuardProps) {
  const hasAccess = checkUserRole(requiredRoles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
