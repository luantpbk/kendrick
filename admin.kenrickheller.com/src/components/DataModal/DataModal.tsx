import React from 'react';
import styled from 'styled-components';
import './DataModal.css';

interface IDataModal {
  width?: string;
  height?: string;
  title?: string;
  children: React.ReactNode;
  posX?: string;
  posY?: string;
  removeModal?: () => void;
  visible?: boolean;
}
interface IWrapper {
  width?: string;
  height?: string;
  backGround?: string;
  isContext?: boolean;
}

const DataModal: React.FC<IDataModal> = (props) => {
  const {
    width,
    height,
    title,
    children,
    posX,
    posY,
    removeModal,
  } = props;

 
  return (
    <WrapperContainer top={posY} left={posX}>
      <div className="header-data-modal">
        <label style={{flex: 1}}>{title}</label>
        <span className="material-icons" onClick={removeModal}>clear</span>
      </div>
      <WrapperModal width={width} height={height}>
        {children}
      </WrapperModal>
    </WrapperContainer>
  );
};

export default DataModal;

const WrapperModal = styled.div((_props: IWrapper) => {
  return {
    width: _props.width ? _props.width : '100%',
    height: _props.height ? _props.height : 'fit-content',
    overflow: 'scroll'
  };
});

const WrapperContainer = styled.div<{ top?: string; left?: string }>`
  top: ${({ top }) => top || '50%'};
  left: ${({ left }) => left || '50%'};
  position: fixed;
  z-index: 150;
  width: fit-content;
  height: fit-content;
  max-width: calc(100% - 10px);
  transition: 1s;
  border: 2px solid #256cb8;
  transform: translate(-50%, -50%);
  box-shadow: lightgrey 0px 0px 6px 1px;
`;
