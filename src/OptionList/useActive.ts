import * as React from 'react';
import CascaderContext from '../context';

/**
 * Control the active open options path.
 */
const useActive = (
  multiple?: boolean,
  open?: boolean,
): [React.Key[], (activeValueCells: React.Key[]) => void] => {
  const { values } = React.useContext(CascaderContext);

  const firstValueCells = values[0];

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<React.Key[]>([]);

  React.useEffect(
    () => {
      if (!multiple) {
        setActiveValueCells(firstValueCells || []);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [open, firstValueCells],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  return [activeValueCells, setActiveValueCells];
};

export default useActive;
