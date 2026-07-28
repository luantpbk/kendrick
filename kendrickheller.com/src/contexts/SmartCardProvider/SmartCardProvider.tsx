import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { useGetProfileInfo, useRefreshState } from 'src/state/application/hooks';
import { Profile } from 'src/state/application/models';


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

  // const isBlured = useRef(false);
  // const refreshState = useRefreshState();

  // useEffect(() => {
  //   const onChange = (e: StorageEvent) => {
  //     if (isBlured.current) {
  //       console.log("Refresh");
  //       const state = JSON.parse(e.newValue);
  //       if (state?.application) refreshState(state.application);
  //     }
  //   };

  //   const onFocus = () => isBlured.current = false;
  //   const onBlur = () => isBlured.current = true;

  //   window.addEventListener("storage", onChange);
  //   window.addEventListener('focus', onFocus);
  //   window.addEventListener('blur', onBlur);
  //   return () => {
  //     window.removeEventListener("storage", onChange);
  //     window.removeEventListener("focus", onFocus);
  //     window.removeEventListener("blur", onBlur);
  //   };
  // }, [refreshState]);


  return <Context.Provider value={value}>{children}</Context.Provider>;
};
