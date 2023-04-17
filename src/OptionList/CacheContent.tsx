import * as React from 'react';

export interface CacheContentProps {
  children?: React.ReactNode;
  open?: boolean;
}

const CacheContent = React.memo(
  ({ children }: CacheContentProps) => children as React.ReactElement,
  (_, next) => !next.open,
);

if (process.env.NODE_ENV !== 'production') {
  CacheContent.displayName = 'CacheContent';
}

export default CacheContent;
