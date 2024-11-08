import { HttpErrors } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { UserType } from '../utils/constants';

export function checkUserAccess(currentUser: UserProfile, resourceId: string) {
  // Allow admin to access everything
  if (currentUser.role === UserType.ADMIN) {
    return;
  }

  // For non-admin users, check if they own the resource
  if (currentUser.id !== resourceId) {
    throw new HttpErrors.Forbidden('Access denied');
  }
}

export function isAdmin(currentUser: UserProfile): boolean {
  return currentUser.role === UserType.ADMIN;
} 

