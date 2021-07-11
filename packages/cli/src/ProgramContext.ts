import React from 'react';
import { ProgramContextType } from './types';

// @ts-expect-error Ignore default value
export const ProgramContext = React.createContext<ProgramContextType>();
