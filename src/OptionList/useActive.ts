import * as React from 'react';
import CascaderContext from '../context';

/**
 * Control the active open options path.
 */
export default (
  multiple: boolean,
  open: boolean,
): [React.Key[], (activeValueCells: React.Key[]) => void] => {
  const { values } = React.useContext(CascaderContext);

  const firstValueCells = values[0];

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<React.Key[]>([]);

  // use useLayoutEffect Prevent flickering
  React.useLayoutEffect(() => {
    if (open && !multiple) {
      setActiveValueCells(firstValueCells || []);
      // no values run reset activeValueCells
    } else if (values.length === 0) {
      setActiveValueCells([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, firstValueCells]);

  return [activeValueCells, setActiveValueCells];
};
