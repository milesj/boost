import React, { useEffect, useReducer } from 'react';
import { applyStyle } from '../../helpers';

export function Cursor() {
  const [count, forceUpdate] = useReducer((sum: number) => sum + 1, 0);

  useEffect(() => {
    // eslint-disable-next-line no-magic-numbers
    const timer = setInterval(forceUpdate, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{applyStyle('▮', count % 2 === 0 ? 'notice' : 'inverted')}</>;
}
