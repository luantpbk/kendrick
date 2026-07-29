import React, { createContext, useContext, useState, useCallback } from 'react';
import TranslationPromptModal from '../../components/Popups/TranslationPromptModal/TranslationPromptModal';

type TranslationContextType = {
  showPrompt: (data: any) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

  const showPrompt = useCallback((data: any) => {
    setScanData(data);
    setIsOpen(true);
  }, []);

  const closePrompt = useCallback(() => {
    setIsOpen(false);
    setScanData(null);
  }, []);

  const contextValue = React.useMemo(() => ({ showPrompt }), [showPrompt]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
      {isOpen && (
        <TranslationPromptModal data={scanData} isOpen={isOpen} onClose={closePrompt} />
      )}
    </TranslationContext.Provider>
  );
};

export const useTranslationPrompt = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationPrompt must be used within a TranslationProvider');
  }
  return context;
};
