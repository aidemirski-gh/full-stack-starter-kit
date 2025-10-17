import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
}

export function useRoleAccess(requiredRoles: string | string[]) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAccess = () => {
      // Check authentication
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      try {
        const userData: User = JSON.parse(userStr);
        setUser(userData);

        // Get user's roles
        const userRoles = userData.roles || [];

        // Convert requiredRoles to array if it's a string
        const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

        // Check if user has any of the required roles
        const hasRequiredRole = rolesArray.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          // Redirect to dashboard with error message
          router.push('/dashboard?error=unauthorized');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking role access:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiredRoles, router]);

  return { hasAccess, loading, user };
}

export function checkUserRole(requiredRoles: string | string[]): boolean {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    return false;
  }

  try {
    const userData: User = JSON.parse(userStr);
    const userRoles = userData.roles || [];
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    return rolesArray.some(role => userRoles.includes(role));
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}
