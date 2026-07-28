/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, memo, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

interface ModalsContext {
  content?: ModalInfo[];
  onPresent: (content: React.FC<any>, props: object, title?: string, backdropClick?: boolean, id?: string) => string;
  onDismiss: (id: string) => void;
}

export const Context = createContext<ModalsContext>({
  onPresent: () => '',
  onDismiss: () => { },
});

interface ModalInfo {
  id: string;
  content?: React.FC;
  props: object;
  title?: string;
  backdropClick?: boolean;
}

interface ModalsProps {
  children: React.ReactNode
}

const ModalsProvider: React.FC<ModalsProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalInfo[]>([]);

  const present = (modal: ModalInfo) => {
    setModals((oldList) => {
      return [...oldList, modal];
    });
  };


  const handlePresent = useCallback(
    (modalContent: React.FC, props: object, title?: string, backdropClick?: boolean, id?: string) => {
      id = id || v4();
      present({ id, content: modalContent, props: { ...props, isPopup: true }, title, backdropClick });
      return id;
    },
    [],
  );

  const handleDismiss = useCallback((id: string) => {
    setModals((data) => data.filter((t) => t.id !== id));
  }, [modals]);

  const backdropClick = useCallback(() => {
    if (modals.length === 0) {
      return;
    }
    setModals((data) => data.slice(0, data.length - 1));
  }, [modals]);


  return (
    <Context.Provider
      value={{
        content: modals,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {modals?.length > 0 ? <StyledBackGround /> : null}
      {modals?.map((modal, index: number) => (
        <StyledModalWrapper key={`modal${index}`}>
          <StyledBackdrop onClick={modal.backdropClick ? backdropClick : undefined} />
          <ModalContent isBorder={modal.title != undefined}>
            {modal.title ? <HeaderData>
              <label style={{ flex: 1 }}>{modal.title}</label>
              <span className="material-icons" onClick={() => handleDismiss(modal.id)}>clear</span>
            </HeaderData> : null}
            <modal.content {...modal.props} />

          </ModalContent>
        </StyledModalWrapper>
      ))}
    </Context.Provider>
  );
};

const HeaderData = styled.div`
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  width: 100%;
  padding: 8px;
  background-color: #256cb8;
  color: white;
  font-weight: 500;
`;

const ModalContent = styled.div<{ isBorder: boolean }>`
  top: 50%;
  left: 50%;
  position: fixed;
  z-index: 150;
  width: fit-content;
  height: fit-content;
  max-width: 100%;
  transition: 1s;
  border: ${({ isBorder }) => isBorder ? '2px solid #256cb8' : 'none'};
  transform: translate(-50%, -50%);
  box-shadow: grey 0px 0px 6px 1px;
  z-index: 2;
`;



const StyledModalWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
`;

const StyledBackdrop = styled.div`
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledBackGround = styled.div`
  background-color: #222222;
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
`;

export default memo(ModalsProvider);
