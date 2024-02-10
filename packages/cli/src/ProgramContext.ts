import { createContext } from 'react';
import { ProgramContextType } from './types';

// @ts-expect-error Ignore default value
export const ProgramContext = createContext<ProgramContextType>();
