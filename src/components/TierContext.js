import { createContext, useContext } from 'react';
export const TierContext = createContext('full');
export const useTier = () => useContext(TierContext);
