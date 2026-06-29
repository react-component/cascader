import { useBaseProps } from '@rc-component/select';
import * as React from 'react';
import RawOptionList, { type RefOptionListProps } from './List';

const RefOptionList = React.forwardRef<RefOptionListProps, Record<string, never>>((props, ref) => {
  const { lockOptions, ...baseProps } = useBaseProps();

  // >>>>> Render
  return <RawOptionList {...props} {...baseProps} lockOptions={lockOptions} ref={ref} />;
});

export default RefOptionList;
