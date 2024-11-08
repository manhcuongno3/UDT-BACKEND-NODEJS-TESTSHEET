import {MetadataInspector} from '@loopback/core';
import {UserType} from '../utils/constants';

// Add this interface definition
export interface AuthorizationMetadata {
  allowedRoles: UserType[];
}

export function authorize(...allowedRoles: UserType[]) {
  return function decorateMethodOrClass(
    target: Object,
    method?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataInspector.defineMetadata<AuthorizationMetadata>(
      'authorize',
      {allowedRoles},
      target,
      method,
    );
  };
} 