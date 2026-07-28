import { uniqueId } from 'lodash';
import React, { useCallback } from 'react';
import { EnumAction, EventButton } from 'src/api/models';
import styled from 'styled-components';
import './ConfirmPopup.css';
import { useTranslation } from 'react-i18next';

interface IConfirmPopup {
  width: string;
  height: string;
  question?: string;
  listActionButton?: EventButton[];
  posX?: string;
  posY?: string;
  removeThisPopup: () => void;
}

const ConfirmPopup: React.FC<IConfirmPopup> = (props) => {
  const { t } = useTranslation();
  const elmButton = props.listActionButton
    ? props.listActionButton.map((button: EventButton, index: number) => {
      return (
        <button key={`confirmpopupbutton${index}`} className="confirm-button" onClick={() => {
          if (button.action) button.action();
          props.removeThisPopup();
        }}>
          <span className="material-icons">{button.icon}</span>
          {t(button.name)}
        </button>
      );
    })
    : null;

  return (
    <WrapperContainer width={props.width} height={props.height}>
      <div className="header-confirm-popup">
        <label style={{ flex: 1 }}>{t("Confirm")}</label>
      </div>
      <WrapperColumn>
        <WrapperRow width={'100%'} height={'50%'}>
          {t(props.question)}
        </WrapperRow>
        <WrapperRow width={'100%'} height={'50%'}>
          {elmButton}
        </WrapperRow>
      </WrapperColumn>
    </WrapperContainer>
  );
};

export default ConfirmPopup;

const WrapperContainer = styled.div<{ width: string; height: string }>`
  top: 50%;
  left: 50%;
  position: fixed;
  z-index: 150;
  width: ${({ width }) => width || 'fit-content'};
  height: ${({ height }) => height || 'fit-content'};
  overflow: hidden;
  transition: 1s;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid #256cb8;
  box-shadow: gray 0px 4px 5px 0px;
`;

const WrapperColumn = styled.div<{ width?: string; height?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
  transition: 1s;
`;
const WrapperRow = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
  transition: 1s;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`;
