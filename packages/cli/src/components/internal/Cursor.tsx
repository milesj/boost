import React, { useEffect, useReducer } from 'react';
import { style } from '@boost/terminal';
import { applyStyle } from '../../helpers';

export function Cursor() {
  const [count, forceUpdate] = useReducer((sum: number) => sum + 1, 0);

  // useEffect(() => {
  //   // eslint-disable-next-line no-magic-numbers
  //   const timer = setInterval(forceUpdate, 500);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{count % 2 === 0 ? applyStyle('▮', 'notice') : style.hidden('▮')}</>;
}
