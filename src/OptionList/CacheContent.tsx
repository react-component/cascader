import * as React from 'react';

export interface CacheContentProps {
  children?: React.ReactNode;
  open?: boolean;
  lockOptions?: boolean;
}

const CacheContent = React.memo(
  ({ children }: CacheContentProps) => children as React.ReactElement,
  (_, next) => !next.open && next.lockOptions,
);

if (process.env.NODE_ENV !== 'production') {
  CacheContent.displayName = 'CacheContent';
}

export default CacheContent;
