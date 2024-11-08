export function sanitizeFilter(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Find the filter parameter in the arguments
      const filterIndex = args.findIndex(arg => arg && typeof arg === 'object' && 'order' in arg);
      
      if (filterIndex !== -1) {
        const filter = args[filterIndex];
        // Remove invalid order value
        if (filter.order === 'string') {
          delete filter.order;
        }
        // Clean up include relations if they exist
        if (filter.include) {
          filter.include = filter.include.filter((item: any) => item !== 'string');
          filter.include.forEach((include: any) => {
            if (include.scope?.order === 'string') {
              delete include.scope.order;
            }
          });
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
} 