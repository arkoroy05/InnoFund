import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Avatar skeleton */}
          <Skeleton className="h-12 w-12 rounded-full" />
          
          <div className="space-y-2 flex-1">
            {/* Title skeleton */}
            <Skeleton className="h-4 w-[250px]" />
            
            {/* Content skeleton - two lines */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            
            {/* Footer skeleton */}
            <div className="flex space-x-4 pt-2">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-3 w-[70px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;