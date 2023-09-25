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

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<React.Key[]>([]);

  React.useEffect(
    () => {
      if (open && !multiple) {
        const firstValueCells = values[0];
        setActiveValueCells(firstValueCells || []);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [open],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  return [activeValueCells, setActiveValueCells];
};
