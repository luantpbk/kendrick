import React, { createContext, useMemo } from 'react';
import { Profile } from 'src/api/models';
import { useGetProfileInfo } from 'src/state/application/hooks';

export interface SmartCardContext {
  profile: Profile;
}

export const Context = createContext<SmartCardContext>({ profile: null });

interface SmartCardProviderProps {
  children: React.ReactNode;
}

export const SmartCardProvider: React.FC<SmartCardProviderProps> = ({ children }) => {
  const profile = useGetProfileInfo();
  const value = useMemo(() => {
    return { profile };
  }, [profile]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
