import {createContext, useContext} from 'react';
import { useConfirmInfo } from './useConfirmInfo';

const CombinedContext = createContext<any>(null);
export const TSAProvider = ({children}: {children: React.ReactNode}) => {
  const { stateConfirm, dispatchConfirm } = useConfirmInfo();
  return (
    <CombinedContext.Provider value={{ stateConfirm, dispatchConfirm }}>
      {children}
    </CombinedContext.Provider>
  );
};

export const useTSAContext = () => {
  const context = useContext(CombinedContext);
  if (!context) {
    throw new Error('useTSAContext must be used within a TSAProvider');
  }
  return context;
};
