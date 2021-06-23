import * as React from 'react';

/**
 * Work like `componentDidUpdate`
 */
export default function useUpdateEffect(updater: () => void, condition?: any[]) {
  const prepareRef = React.useRef(true);

  React.useEffect(() => {
    if (prepareRef.current) {
      prepareRef.current = false;
      return;
    }

    // eslint-disable-next-line consistent-return
    return updater();
  }, condition);
}
