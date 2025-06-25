import { Suspense } from 'react';
import { LoadingScreen } from '../ui/LoadingSpinner';

const LazyWrapper = ({ children, fallback = <LoadingScreen /> }) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;