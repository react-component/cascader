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
  const lastValuesRef = React.useRef(null);

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<React.Key[]>([]);

  // use useLayoutEffect timely update of DOM calculation position and Prevent flickering
  React.useLayoutEffect(() => {
    if (open && !multiple) {
      // firstValueCells clear use delay update
      if (lastValuesRef.current && !firstValueCells) {
        setTimeout(() => {
          setActiveValueCells([]);
        }, 0);
      } else {
        setActiveValueCells(firstValueCells || []);
      }
    }

    lastValuesRef.current = firstValueCells;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, firstValueCells]);

  return [activeValueCells, setActiveValueCells];
};
